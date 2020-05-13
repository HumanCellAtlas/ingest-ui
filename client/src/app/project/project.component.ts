import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';

import {AlertService} from '../shared/services/alert.service';
import {IngestService} from '../shared/services/ingest.service';
import {SubmissionEnvelope} from '../shared/models/submissionEnvelope';
import {LoaderService} from '../shared/services/loader.service';
import {Project} from '../shared/models/project';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})


export class ProjectComponent implements OnInit {
  submissionEnvelopes: SubmissionEnvelope[];

  profile: object;

  project: Project;

  projectId: string;
  projectUuid: string;
  upload: boolean = false;
  selectedProjectTab: number = 0;
  userIsWrangler: boolean;

  constructor(
    private alertService: AlertService,
    private ingestService: IngestService,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService
  ) {
  }

  ngOnInit() {
    this.initProject();
    this.ingestService.getUserAccount().subscribe(account => {
      this.userIsWrangler = account.isWrangler();
    });
  }

  getProject(id) {
    this.ingestService.getProject(id).subscribe(projectData => {
      this.setProjectData(projectData);
    }, error => {
      console.error(error);
      this.alertService.error('Project Not Found', `Project could not be found.`, true, true);
      this.router.navigate([`/projects`]);
    });

  }

  getProjectByUuid(uuid) {
    this.ingestService.getProjectByUuid(uuid).subscribe(projectData => {
      this.setProjectData(projectData);
    }, error => {
      console.error(error);
      this.alertService.error('Project Not Found', `Project ${uuid} was not found.`, true, true);
      this.router.navigate([`/projects`]);
    });
  }

  setProjectData(projectData) {
    this.project = projectData;
    const submissions_url = projectData['_links']['submissionEnvelopes']['href'];
    this.ingestService.get(submissions_url).subscribe(
      submissionData => {
        const submissions = submissionData['_embedded'] ? submissionData['_embedded']['submissionEnvelopes'] : [];
        this.submissionEnvelopes = submissions;
      }
    );
  }

  getProjectName() {
    return this.project && this.project['content'] ? this.project['content']['project_core']['project_title'] : '';
  }

  getSubmissionId(submissionEnvelope) {
    const links = submissionEnvelope['_links'];
    return links && links['self'] && links['self']['href'] ? links['self']['href'].split('/').pop() : '';
  }

  getSubmissionUuid(submissionEnvelope) {
    return submissionEnvelope['uuid']['uuid'];
  }

  getProjectId(project) {
    const links = project['_links'];
    return links && links['self'] && links['self']['href'] ? links['self']['href'].split('/').pop() : '';
  }

  onDeleteSubmission(submissionEnvelope: SubmissionEnvelope) {
    const submissionId: String = this.getSubmissionId(submissionEnvelope);
    const projectName = this.getProjectName();
    const projectInfo = projectName ? `(${projectName})` : '';
    const submissionUuid = submissionEnvelope['uuid']['uuid'];
    const message = `This may take some time. Are you sure you want to delete the submission with UUID ${submissionUuid} ${projectInfo} ?`;
    const messageOnSuccess = `The submission with UUID ${submissionUuid} ${projectInfo} was deleted!`;
    const messageOnError = `An error has occurred while deleting the submission w/UUID ${submissionUuid} ${projectInfo}`;
    if (confirm(message)) {
      this.loaderService.display(true);
      this.ingestService.deleteSubmission(submissionId).subscribe(
        data => {
          this.alertService.clear();
          this.alertService.success('', messageOnSuccess);
          this.initProject();
          this.loaderService.display(false);
        },
        err => {
          this.alertService.clear();
          this.alertService.error(messageOnError, err.error.message);
          console.error('error deleting submission', err);
          this.loaderService.display(false);
        });
    }
  }

  onDeleteProject() {
    if (!this.projectId) {
      this.projectId = this.getProjectId(this.project);
    }
    const projectName = this.getProjectName();
    const message = `Delete ${projectName}?`;
    const messageOnSuccess = `Project ${projectName} was deleted!`;
    const messageOnError = `An error has occurred while deleting project ${projectName}`;

    if (confirm(message)) {
      this.loaderService.display(true);
      this.ingestService.deleteProject(this.projectId).subscribe(
        data => {
          this.alertService.clear();
          this.alertService.success('', messageOnSuccess);
          this.loaderService.display(false);
          this.router.navigate(['/home']);
        },
        err => {
          this.alertService.clear();
          this.alertService.error(messageOnError, err.error.message);
          console.error('error deleting project', err);
          this.loaderService.display(false);
        });
    }
  }

  onSwitchUpload() {
    this.upload = !this.upload;

  }

  canSubmit(project: Project) {
    return this.userIsWrangler &&
      !project.hasOpenSubmission &&
      project.validationState.toUpperCase() != 'INVALID' &&
      !(project.validationErrors && project.validationErrors.length > 0);
  }

  private initProject() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.projectUuid = queryParams.get('uuid');
    });

    this.projectId = this.route.snapshot.paramMap.get('id');

    if (this.projectId) {
      this.getProject(this.projectId);
    }

    if (this.projectUuid) {
      this.getProjectByUuid(this.projectUuid);
    }

    if (!this.projectId && !this.projectUuid) {
      this.router.navigate([`/projects`]);
    }
  }

  projectTabChange(tab: number) {
    this.selectedProjectTab = tab;
  }
}
