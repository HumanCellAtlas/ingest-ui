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

  submissionEnvelope: SubmissionEnvelope;

  files: Object[];

  constructor(private ingestService: IngestService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.submissionEnvelopeId = this.route.snapshot.paramMap.get('id');

    this.ingestService.getSubmission(this.submissionEnvelopeId)
      .subscribe( (submission: SubmissionEnvelope) => {
        this.submissionEnvelope = submission;
      })

    this.ingestService.getFiles(this.submissionEnvelopeId)
      .subscribe( data => this.files = data);


  }

}
