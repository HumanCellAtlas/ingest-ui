import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';

import {AlertService} from '../../services/alert.service';
import {AuthService} from '../../../auth/auth.service';
import {IngestService} from '../../services/ingest.service';

import {Project} from '../../models/project';
import {SchemaService} from '../../services/schema.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})


export class ProjectComponent implements OnInit {
  @Input() submissionProjectId: string;
  @Input() submissionEnvelopeId: string;

  editMode: boolean;

  profile: object;

  project: object;

  projectId: string;
  projects: Project[] = <Project[]> [];
  projects$ : Observable<Project[]>;

  projectForm: FormGroup;

  placeholder: object = {
    projectId: 'A short name for your research project',
    name: 'A title for your research project e.g. reflecting your project grant' ,
    description: 'A description of your research experiment'
  };

  constructor(
    private alertService: AlertService,
    private auth: AuthService,
    private fb: FormBuilder,
    private ingestService: IngestService,
    private router: Router,
    private route: ActivatedRoute,
    private schemaService: SchemaService
  ) {}

  ngOnInit() {
    this.projects$ = this.ingestService.getProjects();
    this.projectId = this.route.snapshot.paramMap.get('id');

    if(this.projectId){
      this.editMode = false;
      this.getProject(this.projectId);
    } else {
      this.setToEditMode();
    }
  }

  setToEditMode(){
    this.editMode = true;
    this.createProjectForm();
    this.auth.getProfile((err, profile) => {
      this.profile = profile;
    })
  }

  createProjectForm() {
    this.projectForm = this.fb.group({
      name: [ {value:'', disabled: !this.editMode}, Validators.required],
      description: [{value:'', disabled: !this.editMode}, Validators.required],
      projectId: [{value:'', disabled: !this.editMode},  Validators.required],
      contributors: this.fb.array([])
    });

    if(this.projectId){
      this.initProjectForm();
    }
  }

  getProject(id){
    this.ingestService.getProject(id).subscribe(data => {
      this.project = data;
    });
  }

  updateProject(id, projectData){
    let content = this.project['content'];

    let patch = Object.assign(content, projectData);

    this.ingestService.putProject(id, patch).subscribe(
    data => {
      this.project = data;
      console.log(data);
      this.projectId = this.getProjectId(this.project);
      this.editMode = false;
      this.alertService.success('','Project was successfully updated.');
    },
    err => {
      this.alertService.error('','An error has occurred while saving your updates to this project.');
    });
  }

  createProject(projectData){
    this.ingestService.postProject(projectData).subscribe(data => {
      this.project = data;
      this.router.navigate(['/projects/list']);
      this.alertService.success('','Project was successfully created.');
    },

    err => {
      this.alertService.error('', 'An error has occurred while creating the project.');
      console.log(err);
    });
  }

  createOrUpdateProject(formValue) {
    if(formValue['name'] && formValue['description'] && formValue['projectId']){
      let projectData = this.extractProject(formValue);

      if(this.projectId){
        this.updateProject(this.projectId, projectData);
      }else{
        this.createProject(projectData);
      }
    } else {
      this.alertService.error('','All fields are required!');
    }
  }

  extractProject(formValue){
    return {
      describedBy: 'https://schema.humancellatlas.org/type/project/5.0.1/project',
      schema_version: '5.0.0',
      schema_type: 'project',
      project_core: {
        describedBy: 'https://schema.humancellatlas.org/core/project/5.0.0/project_core',
        project_shortname: formValue['projectId'],
        project_title: formValue['name'],
        project_description: formValue['description']
      },
      contributors: [{
        describedBy: 'https://schema.humancellatlas.org/module/project/5.0.0/contact',
        email: this.profile['email'],
        contact_name: this.profile['name']
      }]
    };
  }

  save(formValue){
    this.createOrUpdateProject(formValue)
  }

  cancel(){
    this.router.navigate(['/projects/list']);
  }

  newSubmission(){
    this.router.navigate(['submissions/new/metadata']);
  }

  getProjectId(project){
    let links = project['_links'];
    return links && links['self'] && links['self']['href'] ? links['self']['href'].split('/').pop() : '';
  }

  initProjectForm(){
    this.ingestService.getProject(this.projectId)
      .subscribe(data => {
        this.project = data;
        this.projectForm.patchValue({
          projectId: this.project['content']['project_core']['project_shortname'],
          name: this.project['content']['project_core']['project_title'],
          description: this.project['content']['project_core']['project_description']
        });
      });
  }

}
