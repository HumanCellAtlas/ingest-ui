import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Contact, Project} from "../../shared/models/project";
import {IngestService} from "../../shared/ingest.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Route, Router} from "@angular/router";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  projects$ : Observable<Project[]>;
  projects: Project[];
  project: Object;

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
  projectId: string;

  constructor(private ingestService: IngestService,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.projects$ = this.ingestService.getProjects();
    this.projectId = this.route.snapshot.paramMap.get('id');

    this.createProjectForm();
  }

  createOrGetProject(projectFormValue) {
    let id = projectFormValue.existingProjectId;

    if(id){
      this.ingestService.getProject(id).subscribe(data => {
        this.project = data;
      });
    }

    // this.ingestService.postProject(project).subscribe(data => {
    //   this.project = data;
    // });
  }

  saveAndContinue(projectFormValue){
    // render success
    // createNewSubmission

    let submissionId = '5a302bd75cf14c1feb0c6834'
    this.router.navigate(['/submissions', submissionId ]);
  }

  saveAndExit(projectFormValue){
    console.log('submit');
    this.router.navigate(['/projects']);

  }

  getProjectId(project){
    let links = project['_links'];
    return links && links['self'] && links['self']['href'] ? links['self']['href'].split('/').pop() : '';
  }

  viewSubmissions(projectFormValue){
    let projectId = projectFormValue.existingProjectId;
    console.log('viewSubmissions project:' + projectId);

    this.router.navigate(['/submissions/list'], { queryParams: { projectId: projectId } });
  }

  loadProject(event){
    console.log(event);
  }

  createProjectForm() {
    this.projectForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      projectId: [null, Validators.required],
      contributors: this.fb.array([]),
      existingProjectId:''
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
