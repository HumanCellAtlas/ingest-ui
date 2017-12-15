import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Contact, Project} from "../../shared/models/project";
import {IngestService} from "../../shared/ingest.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Route, Router} from "@angular/router";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  projects$ : Observable<Project[]>;
  projects: Project[];
  projectForm: FormGroup;

  placeholder: Object = {
    projectId: "A project id for your research project e.g. HCA-DEMO-PROJECT_ID",
    name: "A title for your research project e.g. reflecting your project grant" +
           "e.g. \"Testing ischaemic sensitivity of human tissue at different time points, using single cell RNA sequencing.\"",
    description: "A description of your research experiment,"+
                 "e.g. \"Assessment of ischaemic sensitivity of three human tissues using 10x 3 single cell RNA sequencing." +
                 "We aim to collect data from three tissues expected to have diffent sensitiy to ischaemia: spleen(expected least sensitive)," +
                 " oesophagus (in the middle) and liver ( expected most sensitive).\""
  };

  editMode: true;

  constructor(private ingestService: IngestService,
              private fb: FormBuilder,
              private router: Router) {
  }

  ngOnInit() {
    this.projects$ = this.ingestService.getProjects();
    this.createProjectForm();
  }

  createProject(newProject) {
    var project = {
      project_id: newProject.projectId,
      name: newProject.name,
      description: newProject.description
    };

    this.ingestService.postProject(project);
    console.log('submit');
    this.router.navigate(['/projects']);
  }

  createProjectForm() {
    this.projectForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      projectId: [null, Validators.required],
      contributors: this.fb.array([]),

    });
  }

  // setContributors(contributors: Contact[]) {
  //   const contributorFGs = contributors.map(contributor => this.fb.group(contributor));
  //   const contributorFormArray = this.fb.array(contributorFGs);
  //   this.projectForm.setControl('contributors', contributorFormArray);
  // }

  get contributors(): FormArray {
    return this.projectForm.get('contributors') as FormArray;
  };

  addContributor() {
    this.contributors.push(this.fb.group({
      name:'',
      city:'',
      country:'',
      institution:'',
      address:'',
      email:''
    }));
  }

  removeContributor(i: number) {
    console.log('remove contributor');
    const control = <FormArray> this.projectForm.controls['contributors'];
    control.removeAt(i);
  }
}
