import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {interval, Observable} from 'rxjs';
import {concatMap, delay, filter, map, takeWhile} from 'rxjs/operators';
import {IngestService} from '../shared/services/ingest.service';
import {AlertService} from '../shared/services/alert.service';
import {SubmissionEnvelope} from '../shared/models/submissionEnvelope';
import {LoaderService} from '../shared/services/loader.service';
import {BrokerService} from '../shared/services/broker.service';
import {Project} from '../shared/models/project';
import {ArchiveEntity} from '../shared/models/archiveEntity';
import {ListResult} from '../shared/models/hateoas';


@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit, OnDestroy {

  submissionEnvelopeId: string;
  submissionEnvelopeUuid: string;
  submissionEnvelope$: Observable<any>;
  submissionEnvelope;
  submissionState: string;
  isValid: boolean;
  isLinkingDone: boolean;
  isSubmitted: boolean;
  submitLink: string;
  exportLink: string;
  cleanupLink: string;
  url: string;
  project: Project;
  project$: Observable<Project>;
  projectUuid: string;
  projectTitle: string;
  projectShortName: string;
  manifest: Object;
  submissionErrors: Object[];
  selectedIndex: any = 0;
  archiveEntities: ArchiveEntity[];
  private alive: boolean;
  private pollInterval: number;
  private MAX_ERRORS = 9;

  constructor(
    private alertService: AlertService,
    private ingestService: IngestService,
    private brokerService: BrokerService,
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService
  ) {
    this.pollInterval = 4000; // 4s
    this.alive = true;
  }

  private static getSubmissionId(submissionEnvelope) {
    const links = submissionEnvelope['_links'];
    return links && links['self'] && links['self']['href'] ? links['self']['href'].split('/').pop() : '';
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.submissionEnvelopeUuid = queryParams.get('uuid');
      this.submissionEnvelopeId = queryParams.get('id');
      this.projectUuid = queryParams.get('project');
    });

    this.pollSubmissionEnvelope();
    this.pollEntities();

    this.getArchiveEntities(this.submissionEnvelopeUuid);
  }

  ngOnDestroy() {
    this.alive = false; // switches your IntervalObservable off
  }

  checkIfValid(submission) {
    const status = submission['submissionState'];
    return (status === 'Valid' || this.isStateSubmitted(status));
  }

  getSubmissionProject(id) {
    this.project$ = this.ingestService.getSubmissionProject(id);
    this.project$.subscribe(project => {
      this.setProject(project);
    });
  }

  setProject(project) {
    if (project) {
      this.project = project;
      this.projectShortName = this.getProjectShortName();
      this.projectTitle = this.getProjectTitle();
      this.projectUuid = this.getProjectUuid();
    }
  }

  getProjectShortName() {
    return this.project && this.project['content'] && this.project['content']['project_core'] ?
      this.project['content']['project_core']['project_short_name'] : '';
  }

  getProjectTitle() {
    return this.project && this.project['content'] && this.project['content']['project_core'] ?
      this.project['content']['project_core']['project_title'] : '';
  }

  getProjectUuid() {
    return this.project && this.project['uuid'] ? this.project['uuid']['uuid'] : '';
  }

  isStateSubmitted(state) {
    const submittedStates = ['Submitted', 'Processing', 'Archiving', 'Archived', 'Exporting', 'Exported', 'Cleanup', 'Complete'];
    return (submittedStates.indexOf(state) >= 0);
  }

  getLink(submissionEnvelope, linkName) {
    const links = submissionEnvelope['_links'];
    return links && links[linkName] ? links[linkName]['href'] : null;
  }

  downloadFile() {
    const uuid = this.submissionEnvelope['uuid']['uuid'];
    this.brokerService.downloadSpreadsheet(uuid).subscribe(response => {
      const filename = response['filename'];
      const newBlob = new Blob([response['data']]);

      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const data = window.URL.createObjectURL(newBlob);

      const link = document.createElement('a');
      link.href = data;
      link.download = filename;
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    });
  }

  onDeleteSubmission(submissionEnvelope: SubmissionEnvelope) {
    const submissionId: String = SubmissionComponent.getSubmissionId(submissionEnvelope);
    const projectInfo = this.projectTitle ? `(${this.projectTitle})` : '';
    const submissionUuid = submissionEnvelope['uuid']['uuid'];
    const message = `This may take some time. Are you sure you want to delete the submission with UUID ${submissionUuid} ${projectInfo} ?`;
    const messageOnSuccess = `The submission with UUID ${submissionUuid} ${projectInfo} was deleted!`;
    const messageOnError = `An error has occurred while deleting the submission w/UUID ${submissionUuid} ${projectInfo}`;

    if (confirm(message)) {
      this.loaderService.display(true);
      this.ingestService.deleteSubmission(submissionId).subscribe(
        () => {
          this.alertService.clear();
          this.alertService.success('', messageOnSuccess, true, true);
          this.loaderService.display(false);
          this.router.navigate(['/projects/detail'], {queryParams: {uuid: this.projectUuid}});
        },
        err => {
          this.alertService.clear();
          this.alertService.error(messageOnError, err.error.message, true, true);
          console.log('error deleting submission', err);
          this.loaderService.display(false);
          this.router.navigate(['/projects/detail'], {queryParams: {uuid: this.projectUuid}});
        }
      );
    }
  }

  isSubmissionLoading() {
    return !(this.project$ && this.submissionEnvelope$ && (this.manifest || this.isLinkingDone));
  }

  getContributors(project: Project) {
    let contributors = project && project.content && project.content['contributors'];
    contributors = contributors ? project.content['contributors'] : [];
    const correspondents = contributors.filter(contributor => contributor['corresponding_contributor'] === true);
    return correspondents.map(c => c['name']).join(' | ');
  }

  private pollSubmissionEnvelope() {
    interval(this.pollInterval)
      .pipe(takeWhile(() => this.alive)) // only fires when component is alive
      .subscribe(() => {
        this.getSubmissionEnvelope();
        if (this.submissionEnvelope) {
          this.getSubmissionErrors();
          this.getSubmissionManifest();
        }
      });
  }

  private pollEntities() {
    interval(this.pollInterval)
      .pipe(
        delay(500),
        takeWhile(() => this.alive), // only fires when component is alive);
        filter(() => this.submissionEnvelopeId.length > 0)
      ).subscribe(() => this.getSubmissionProject(this.submissionEnvelopeId));
  }

  private getArchiveEntitiesFromSubmission(submissionUuid: string): Observable<ArchiveEntity[]> {
    return this.ingestService.getArchiveSubmission(submissionUuid)
      .pipe(
        filter(data => 'entities' in data._links),
        filter(data => 'href' in data._links['entities']),
        concatMap(data => this.ingestService.getAs<ListResult<ArchiveEntity>>(data._links['entities']['href'])),
        map(data => data._embedded ? data._embedded.archiveEntities : [])
      );
  }

  private getSubmissionEnvelope() {
    if (this.submissionEnvelopeId) {
      this.submissionEnvelope$ = this.ingestService.getSubmission(this.submissionEnvelopeId);
    } else if (this.submissionEnvelopeUuid) {

      this.submissionEnvelope$ = this.ingestService.getSubmissionByUuid(this.submissionEnvelopeUuid);
    } else {
      this.submissionEnvelope$ = null;
    }

    if (this.submissionEnvelope$) {
      this.submissionEnvelope$
        .subscribe(data => {
          this.submissionEnvelope = data;
          this.submissionEnvelopeId = SubmissionComponent.getSubmissionId(data);
          this.isValid = this.checkIfValid(data);
          this.submissionState = data['submissionState'];
          this.isSubmitted = this.isStateSubmitted(data.submissionState);
          this.submitLink = this.getLink(data, 'submit');
          this.exportLink = this.getLink(data, 'export');
          this.cleanupLink = this.getLink(data, 'cleanup');
          this.url = this.getLink(data, 'self');
        });
    }
  }

  private getSubmissionErrors() {
    this.ingestService.get(this.submissionEnvelope['_links']['submissionEnvelopeErrors']['href'])
      .subscribe(
        data => {
          this.submissionErrors = data['_embedded'] ? data['_embedded']['submissionErrors'] : [];
          if (this.submissionErrors.length > 0) {
            this.alertService.clear();
          }

          if (this.submissionErrors.length > this.MAX_ERRORS) {
            const link = this.submissionEnvelope._links.submissionEnvelopeErrors.href;
            const message = `Cannot show more than ${this.MAX_ERRORS} errors.`;
            this.alertService.error(
              `${this.submissionErrors.length - this.MAX_ERRORS} Other Errors`,
              `${message} <a href="${link}">View all ${this.submissionErrors.length} errors.</a>`,
              false,
              false);
          }
          let errors_displayed = 0;
          for (const err of this.submissionErrors) {
            if (errors_displayed >= this.MAX_ERRORS) {
              break;
            }
            this.alertService.error(err['title'], err['detail'], false, false);
            errors_displayed++;
          }
        }
      );
  }

  private getArchiveEntities(submissionUuid: string) {
    this.getArchiveEntitiesFromSubmission(submissionUuid).subscribe(data => this.archiveEntities = data);
  }

  private getSubmissionManifest() {
    this.ingestService.get(this.submissionEnvelope['_links']['submissionManifest']['href'])
      .subscribe(
        data => {
          this.manifest = data;
          const actualLinks = this.manifest['actualLinks'];
          const expectedLinks = this.manifest['expectedLinks'];
          if (!expectedLinks || (actualLinks === expectedLinks)) {
            this.isLinkingDone = true;
          }
        }, err => {
          if (err instanceof HttpErrorResponse && err.status === 404) {
            // do nothing, the endpoint throws error when no submission manifest is found
            this.isLinkingDone = true;
          } else {
            console.error(err);
          }
        });
  }
}
