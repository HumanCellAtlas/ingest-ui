import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs";
import {IngestService} from "../shared/services/ingest.service";
import {SubmissionEnvelope} from "../shared/models/submissionEnvelope";
import {ActivatedRoute} from "@angular/router";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {FlattenService} from "../shared/services/flatten.service";
import {AlertService} from "../shared/services/alert.service";


@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit {
  submissionEnvelopeId: string;
  projectId: string;

  submissionEnvelope$: Observable<any>;
  submissionEnvelope;
  submissionState: string;
  submissionErrors: string;


  activeTab: string;

  isSubmittable: boolean;
  isSubmitted: boolean;
  submitLink: string;
  url:string;

  project: any;

  projectName: string;

  private alive: boolean;
  private pollInterval: number;

  manifest: Object;

  constructor(
    private alertService: AlertService,
    private ingestService: IngestService,
    private route: ActivatedRoute,
    private flattenService: FlattenService) {
      this.pollInterval = 4000; //4s
      this.alive = true;
      this.manifest = {};
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
            this.isSubmitted = this.isStateSubmitted(data.submissionState)
            this.submitLink = this.getLink(data, 'submit');
            this.url = this.getLink(data, 'self')
            let err = data['submissionErrors'] ? data['submissionErrors'][0] : null;
            if (err){
              this.alertService.clear();
              this.alertService.error(err['message'],
                `${err['errorCode']} : ${err['details']}`,
                false, false);
              console.log(err);
            }
          });
        this.ingestService.getSubmissionManifest(this.submissionEnvelopeId)
          .subscribe(data => {
            this.manifest = data;
          });
      });
  }

  pollEntities(){
    TimerObservable.create(500, this.pollInterval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        if(this.submissionEnvelopeId){
          this.getSubmissionProject(this.submissionEnvelopeId);
        }
      });
  }

  checkIfValid(submission){
    let status = submission['submissionState'];
    let validStates = ["Valid", "Submitted", "Processing", "Cleanup", "Complete"];
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
    return this.project && this.project['content'] ? this.project['content']['project_core']['project_title'] : '';
  }


  isStateSubmitted(state){
    let submittedStates = [ "Submitted", "Processing" , "Cleanup", "Complete"];
    return (submittedStates.indexOf(state) >= 0);
  }

  getLink(submissionEnvelope, linkName){
    let links = submissionEnvelope['_links'];
    return links && links[linkName]? links[linkName]['href'] : null;
  }

  /**
   * Return the CSS class name corresponding to the current submission state value, for styling the submission state
   * chip.
   *
   * @param submissionState {string}
   * @returns {string}
   */
  getSubmissionStateChipClassName(submissionState: string): string {

    if ( submissionState === 'Pending' || submissionState === 'Draft' ) {
      return 'warning';
    }

    if ( submissionState === 'Valid' ) {
      return 'success';
    }

    if ( submissionState === 'Validating' ) {
      return 'info';
    }

    if ( submissionState === 'Invalid' ) {
      return 'danger';
    }

    if ( submissionState === 'Submitted' ) {
      return 'secondary';
    }

    if ( submissionState === 'Processing' || submissionState === 'Cleanup' ) {
      return 'warning-invert';
    }

    if ( submissionState === 'Complete' ) {
      return 'success-invert';
    }

    return '';
  }
}
