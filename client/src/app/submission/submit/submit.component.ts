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
  @Input() submitLink;
  @Input() bundles: Object[];

  constructor(private ingestService: IngestService,
              private router: Router) {
  }

  ngOnInit() {
  }

  completeSubmission(submission) {
    console.log('completeSubmission');
    this.ingestService.submit(this.submitLink);
  }



}
