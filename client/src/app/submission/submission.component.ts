import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

  selectedProjectId: string;

  files: Object[];

  activeTab: string;

  constructor(private ingestService: IngestService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.submissionEnvelopeId = this.route.snapshot.paramMap.get('id');
    let tab = this.route.snapshot.paramMap.get('tab');
    this.activeTab = tab ? tab.toLowerCase() : '';


    if(this.submissionEnvelopeId){
      this.ingestService.getSubmission(this.submissionEnvelopeId)
        .subscribe( (submission: SubmissionEnvelope) => {
          this.submissionEnvelope = submission;
        })

      this.ingestService.getFiles(this.submissionEnvelopeId)
        .subscribe( data => this.files = data);
    }
  }

  setSubmissionProjectId(event){
    this.selectedProjectId = event;
    console.log('selected project' + this.selectedProjectId);
    this.activeTab = 'metadata';
  }

}
