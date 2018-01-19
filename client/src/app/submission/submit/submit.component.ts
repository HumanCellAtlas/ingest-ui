import {Component, Input, OnInit} from '@angular/core';
import {IngestService} from "../../shared/services/ingest.service";
import {SubmissionEnvelope} from "../../shared/models/submissionEnvelope";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css']
})
export class SubmitComponent implements OnInit {
  @Input() submissionEnvelopeId;
  @Input() submissionEnvelope$;
  @Input() submitLink: string;
  @Input() isSubmitted: boolean;

  constructor(private ingestService: IngestService) {
  }

  ngOnInit() {
  }

  completeSubmission() {
    console.log('completeSubmission');
    this.ingestService.submit(this.submitLink);
  }


}
