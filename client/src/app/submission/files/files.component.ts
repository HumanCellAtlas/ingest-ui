import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {IngestService} from "../../shared/ingest.service";
import {SubmissionEnvelope} from "../../shared/models/submissionEnvelope";

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  @Input() submissionEnvelopeId;
  // @Input() submissionEnvelope$:Observable<SubmissionEnvelope>;@Input() submissionEnvelope:SubmissionEnvelope;
  @Input() submissionEnvelope;

  @Input() files : Object[];
  uploadDetails: Object;


  constructor(private ingestService: IngestService) { }

  ngOnInit() {
    // this.submissionEnvelope$.subscribe((submission: SubmissionEnvelope) => {
    //   this.uploadDetails = submission['stagingDetails'];
    //   console.log(submission);
    // });
    // this.uploadDetails = this.submissionEnvelope['stagingDetails']

  }


}
