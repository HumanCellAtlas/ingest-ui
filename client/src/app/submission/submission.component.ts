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
  samples: Object[];
  analyses: Object[];
  assays: Object[];
  bundles: Object[];
  protocols: Object[];

  constructor(private ingestService: IngestService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('id: '+id)
    this.submissionEnvelopeId = '5a29dc366d51677f20c8b183';

    this.ingestService.getSubmission(this.submissionEnvelopeId)
      .subscribe( (submission: SubmissionEnvelope) => {
        this.submissionEnvelope = submission;
      })

    this.ingestService.getFiles(this.submissionEnvelopeId)
      .subscribe( data => this.files = data);
    this.ingestService.getSamples(this.submissionEnvelopeId)
      .subscribe(data => this.samples = data);
    this.ingestService.getAnalyses(this.submissionEnvelopeId)
      .subscribe(data => this.analyses = data);
    this.ingestService.getAssays(this.submissionEnvelopeId)
      .subscribe(data => this.assays = data);
    this.ingestService.getBundles(this.submissionEnvelopeId)
      .subscribe(data => this.bundles = data);
    this.ingestService.getProtocols(this.submissionEnvelopeId)
      .subscribe(data => this.protocols = data);

  }

}
