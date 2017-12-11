import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {IngestService} from "../shared/ingest.service";
import {SubmissionEnvelope} from "../shared/models/submissionEnvelope";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {
  submissionEnvelopeId: string;
  submissionEnvelope$: Observable<SubmissionEnvelope>;
  submissionEnvelope: SubmissionEnvelope;

  constructor(private ingestService: IngestService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.getSubmission()
  }

  getSubmission(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.submissionEnvelopeId = '5a29dc366d51677f20c8b183';
    console.log('id: '+id)
    this.ingestService.getSubmission(this.submissionEnvelopeId)
      .subscribe( submission => this.submissionEnvelope = submission)
  }

}
