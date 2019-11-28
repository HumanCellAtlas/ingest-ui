import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';

import {AlertService} from '../../services/alert.service';
import {AuthService} from '../../../auth/auth.service';
import {IngestService} from '../../services/ingest.service';
import {SubmissionEnvelope} from '../../models/submissionEnvelope';

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
    private auth: AuthService,
    private ingestService: IngestService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.projectUuid = queryParams.get("uuid")
    })

    this.projectId = this.route.snapshot.paramMap.get('id');

    if(this.projectId){
      this.getProject(this.projectId);
    }

    if(this.projectUuid){
      this.getProjectByUuid(this.projectUuid);
    }

    if(!this.projectId && !this.projectUuid){
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
    // TODO Find the submission envelope where the project was included for now
    // In the future, find a way to link submission envelopes to related projects in ingest
    let submissions_url = projectData['_links']['submissionEnvelopes']['href']
    this.ingestService.get(submissions_url).subscribe(
      submissionData => {
        let submissions = submissionData['_embedded'] ? submissionData['_embedded']['submissionEnvelopes'] : [];
        this.submissionEnvelopes = submissions;
      }
    )
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

}
