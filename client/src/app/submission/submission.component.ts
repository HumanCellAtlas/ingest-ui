import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IngestService} from '../ingest.service';
import {Observable} from "rxjs/Observable";
import {SubmissionEnvelope} from "../submissionEnvelope";
import {ListResult} from "../hateoas";

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SubmissionComponent implements OnInit {

  submissionEnvelopes$: Observable<SubmissionEnvelope[]>;

  submissionEnvelopeList$: Observable<ListResult<SubmissionEnvelope>>;

  constructor(private ingestService: IngestService) {
  }

  ngOnInit() {
    this.submissionEnvelopes$ = this.ingestService.getAllSubmission();
  }
}


