import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {IngestService} from "../shared/services/ingest.service";
import {SubmissionEnvelope} from "../shared/models/submissionEnvelope";
import {ActivatedRoute} from "@angular/router";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {FlattenService} from "../shared/services/flatten.service";


@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {
  submissionEnvelopeId: string;
  projectId: string;

  submissionEnvelope$: Observable<any>;
  submissionEnvelope;
  submissionState: string;
  submitLink: string;

  analyses: Object[];
  assays: Object[];
  bundles: Object[];
  protocols: Object[];
  samples: Object[];

  activeTab: string;

  isSubmittable: boolean;

  project: any;

  projectName: string;

  private alive: boolean;
  private pollInterval : number;

  constructor(private ingestService: IngestService,
              private route: ActivatedRoute,
              private flattenService: FlattenService) {
    this.pollInterval = 4000; //4s
    this.alive = true;
  }

  ngOnInit() {
    this.submissionEnvelopeId = this.route.snapshot.paramMap.get('id');
    let tab = this.route.snapshot.paramMap.get('tab');
    this.activeTab = tab ? tab.toLowerCase() : '';

    if(!this.submissionEnvelopeId){
      this.projectId = this.route.snapshot.paramMap.get('projectid');
      if(this.projectId){
        this.getProject(this.projectId)
      }
    } else {
      this.pollSubmissionEnvelope(this.submissionEnvelopeId);
      this.pollEntities();
    }
  }

  ngOnDestroy(){
    this.alive = false; // switches your IntervalObservable off
  }

  pollSubmissionEnvelope(id){
    TimerObservable.create(0, this.pollInterval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        this.submissionEnvelope$ = this.ingestService.getSubmission(id);
        this.submissionEnvelope$
          .subscribe(data => {
            this.submissionEnvelope = data;
            this.isSubmittable = this.checkIfValid(data);
            this.submissionState = data['submissionState'];
            this.submitLink = this.getSubmitLink(data);
          });
      });
  }

  pollEntities(){
    TimerObservable.create(500, this.pollInterval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        if(this.submissionEnvelopeId){
          this.ingestService.getBundles(this.submissionEnvelopeId)
            .subscribe(data => this.bundles = data.map(this.flattenService.flatten));
          this.getSubmissionProject(this.submissionEnvelopeId);
        }
      });
  }

  getSubmitLink(submissionEnvelope){
    let links = submissionEnvelope['_links'];
    return links && links['submit']? links['submit']['href'] : null;
  }

  checkIfValid(submission){
    let status = submission['submissionState'];
    let validStates = ["Valid", "Submitted", "Cleanup", "Complete"];
    return (validStates.indexOf(status) >= 0);
  }

  getProject(id){
    this.ingestService.getProject(id)
      .subscribe(project => {
        this.project = project;
        this.projectName = this.getProjectName();
      });
  }

  getSubmissionProject(id){
    this.ingestService.getSubmissionProject(id)
      .subscribe(project => {
        this.project = project;
        this.projectName = this.getProjectName();
      })
  }

  getProjectName(){
    return this.project && this.project['content'] ? this.project['content']['name'] : '';
  }
}
