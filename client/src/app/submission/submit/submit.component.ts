import {Component, Input, OnInit} from '@angular/core';
import {IngestService} from "../../shared/ingest.service";
import {SubmissionEnvelope} from "../../shared/models/submissionEnvelope";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css']
})
export class SubmitComponent implements OnInit {
  @Input() submissionEnvelopeId;
  @Input() submissionEnvelope$: Observable<any>;

  hasSubmitLink: boolean;
  submissionEnvelope: any;

  error;
  success;

  constructor(private ingestService: IngestService) {
    this.error = {
      message: '',
      details: ''
    }
    this.success = {
      message: '',
      details: ''
    }
  }

  ngOnInit() {
    if(this.submissionEnvelope$){
      this.submissionEnvelope$.subscribe( (submission: SubmissionEnvelope) => {
        console.log('submission envelope');
        this.submissionEnvelope = submission;
        this.hasSubmitLink = this.getSubmitLink(submission)
      })
    }
  }

  completeSubmission(submission) {
    let submitLink = this.getSubmitLink(submission);
    this.ingestService.submit(submitLink);
    console.log('completeSubmission');
  }

  getSubmitLink(submissionEnvelope){
    let links = submissionEnvelope['_links'];
    return links && links['submit']? links['submit']['href'] : null;
  }



}
