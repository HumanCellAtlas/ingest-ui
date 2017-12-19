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
  projectId: string;

  submissionEnvelope$: Observable<any>;
  submissionEnvelope;
  submissionState: string;

  activeTab: string;

  isSubmittable: boolean;

  constructor(private ingestService: IngestService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.submissionEnvelopeId = this.route.snapshot.paramMap.get('id');
    let tab = this.route.snapshot.paramMap.get('tab');
    this.activeTab = tab ? tab.toLowerCase() : '';

    if(!this.submissionEnvelopeId){
      this.projectId = this.route.snapshot.paramMap.get('projectid');
    } else {
      this.submissionEnvelope$ = this.ingestService.getSubmission(this.submissionEnvelopeId);
      this.submissionEnvelope$
        .subscribe(data => {
          this.submissionEnvelope = data;
          this.isSubmittable = this.checkIfValid(data);
          this.submissionState = data['submissionState'];
        });
    }
  }

  getSubmitLink(submissionEnvelope){
    let links = submissionEnvelope['_links'];
    return links && links['submit']? links['submit']['href'] : null;
  }

  checkIfValid(submission){
    let status = submission['submissionState'];
    let validStates = ["Valid", "Submitted", "Cleanup", "Complete"];
    console.log(validStates.indexOf(status) >= 0);
    return (validStates.indexOf(status) >= 0);
  }
}
