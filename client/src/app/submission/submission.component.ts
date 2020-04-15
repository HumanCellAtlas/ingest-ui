import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {IngestService} from '../shared/services/ingest.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import {AlertService} from '../shared/services/alert.service';
import {HttpErrorResponse} from '@angular/common/http';
import {SubmissionEnvelope} from '../shared/models/submissionEnvelope';
import {LoaderService} from '../shared/services/loader.service';
import {BrokerService} from '../shared/services/broker.service';


@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit {

  submissionEnvelopeId: string;
  submissionEnvelopeUuid: string;
  submissionEnvelope$: Observable<any>;
  submissionEnvelope;
  submissionState: string;
  isValid: boolean;
  isLinkingDone: boolean;
  isSubmitted: boolean;
  submitLink: string;
  url: string;
  project: any;
  projectUuid: string;
  projectName: string;
  manifest: Object;
  submissionErrors: any[];
  selectedIndex: any = 1;
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
    this.manifest = {};
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
  }

  ngOnDestroy() {
    this.alive = false; // switches your IntervalObservable off
  }

  pollSubmissionEnvelope() {
    TimerObservable.create(0, this.pollInterval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        this.getSubmissionEnvelope();
        if (this.submissionEnvelope) {
          this.getSubmissionErrors();
          this.getSubmissionManifest();
        }
      });
  }

  pollEntities() {
    TimerObservable.create(500, this.pollInterval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        if (this.submissionEnvelopeId) {
          this.getSubmissionProject(this.submissionEnvelopeId);
        }
      });
  }

  checkIfValid(submission) {
    const status = submission['submissionState'];
    const validStates = ['Valid', 'Submitted', 'Processing', 'Archiving', 'Cleanup', 'Complete'];
    return (validStates.indexOf(status) >= 0);
  }

  getSubmissionProject(id) {
    this.ingestService.getSubmissionProject(id)
      .subscribe(project => {
        this.setProject(project);
      });
  }

  setProject(project) {
    if (project) {
      this.project = project;
      this.projectName = this.getProjectName();
      this.projectUuid = this.getProjectUuid();
      this.selectedIndex = 0;
    }
  }

  getProjectName() {
    return this.project && this.project['content'] ? this.project['content']['project_core']['project_title'] : '';
  }

  getProjectUuid() {
    return this.project && this.project['uuid'] ? this.project['uuid']['uuid'] : '';
  }

  isStateSubmitted(state) {
    const submittedStates = ['Submitted', 'Processing', 'Archiving', 'Cleanup', 'Complete'];
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
    const projectInfo = this.projectName ? `(${this.projectName})` : '';
    const submissionUuid = submissionEnvelope['uuid']['uuid'];
    const message = `This may take some time. Are you sure you want to delete the submission with UUID ${submissionUuid} ${projectInfo} ?`;
    const messageOnSuccess = `The submission with UUID ${submissionUuid} ${projectInfo} was deleted!`;
    const messageOnError = `An error has occurred while deleting the submission w/UUID ${submissionUuid} ${projectInfo}`;

    if (confirm(message)) {
      this.loaderService.display(true);
      this.ingestService.deleteSubmission(submissionId).subscribe(
        data => {
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
          this.url = this.getLink(data, 'self');
        });
    }
  }

  private getSubmissionErrors() {
    this.ingestService.get(this.submissionEnvelope['_links']['submissionEnvelopeErrors']['href'])
      .subscribe(
        data => {
          this.submissionErrors = data['_embedded'] ? data['_embedded']['submissionErrors'] : [];
          this.alertService.clear();
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

  private getSubmissionManifest() {
    this.ingestService.get(this.submissionEnvelope['_links']['submissionManifest']['href'])
      .subscribe(
        data => {
          this.manifest = data;
          const actualLinks = this.manifest['actualLinks'];
          const expectedLinks = this.manifest['expectedLinks'];
          if (!expectedLinks || (actualLinks == expectedLinks)) {
            this.isLinkingDone = true;
          }
        }, err => {
          this.isLinkingDone = false;
          if (err instanceof HttpErrorResponse && err.status == 404) {
            // do nothing, the endpoint throws error when no submission manifest is found
          } else {
            console.log(err);
          }
        });
  }
}
