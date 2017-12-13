import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Contact, Project} from "../../shared/models/project";
import {IngestService} from "../../shared/ingest.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  projects$ : Observable<Project[]>;
  projects: Project[];
  projectForm: FormGroup;

  editMode: true;

  constructor(private ingestService: IngestService,
              private fb: FormBuilder) { }

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
