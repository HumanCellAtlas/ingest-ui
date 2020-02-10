import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';

import {AlertService} from '../../services/alert.service';
import {IngestService} from '../../services/ingest.service';
import {SubmissionEnvelope} from '../../models/submissionEnvelope';
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})


export class ProjectComponent implements OnInit {
  submissionEnvelopes: SubmissionEnvelope[];

  profile: object;

  project: object;

  projectId: string;
  projectUuid: string;

  constructor(
    private alertService: AlertService,
    private ingestService: IngestService,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.initProject();
  }

  private initProject() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.projectUuid = queryParams.get("uuid")
    })

    this.projectId = this.route.snapshot.paramMap.get('id');

    if (this.projectId) {
      this.getProject(this.projectId);
    }

    if (this.projectUuid) {
      this.getProjectByUuid(this.projectUuid);
    }

    if (!this.projectId && !this.projectUuid) {
      this.router.navigate([`/projects/list`]);
    }
  }

  getProject(id){
    this.ingestService.getProject(id).subscribe(projectData => {
      this.setProjectData(projectData);
    }, error => {
      this.alertService.error('Project Not Found', `Project could not be found.`, true, true);
      this.router.navigate([`/projects/list`]);
    });

  }

  getProjectByUuid(uuid){
    this.ingestService.getProjectByUuid(uuid).subscribe(projectData => {
      this.setProjectData(projectData);
    }, error => {
      this.alertService.error('Project Not Found', `Project ${uuid} was not found.`, true, true);
      this.router.navigate([`/projects/list`]);
    });
  }

  setProjectData(projectData){
    this.project = projectData;
    let submissions_url = projectData['_links']['submissionEnvelopes']['href']
    this.ingestService.get(submissions_url).subscribe(
      submissionData => {
        let submissions = submissionData['_embedded'] ? submissionData['_embedded']['submissionEnvelopes'] : [];
        this.submissionEnvelopes = submissions;
      }
    )
  }

  getProjectName(){
    return this.project && this.project['content'] ? this.project['content']['project_core']['project_title'] : '';
  }
  getSubmissionId(submissionEnvelope){
    let links = submissionEnvelope['_links'];
    return links && links['self'] && links['self']['href'] ? links['self']['href'].split('/').pop() : '';
  }

  getSubmissionUuid(submissionEnvelope){
    return submissionEnvelope['uuid']['uuid'];
  }

  getProjectId(project){
    let links = project['_links'];
    return links && links['self'] && links['self']['href'] ? links['self']['href'].split('/').pop() : '';
  }

  onDeleteSubmission(submissionEnvelope: SubmissionEnvelope) {
    let submissionId : String = this.getSubmissionId(submissionEnvelope);
    let projectName = this.getProjectName();
    let projectInfo = projectName ? `(${projectName})`: '';
    let submissionUuid = submissionEnvelope['uuid']['uuid'];
    let message = `This may take some time. Are you sure you want to delete the submission with UUID ${submissionUuid} ${projectInfo} ?`;
    let messageOnSuccess = `The submission with UUID ${submissionUuid} ${projectInfo} was deleted!`;
    let messageOnError = `An error has occurred while deleting the submission w/UUID ${submissionUuid} ${projectInfo}`;
    if(confirm(message)){
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
          this.alertService.error(messageOnError, err);
          console.log('error deleting submission', err);
          this.loaderService.display(false);
        });
    }
  }
}
