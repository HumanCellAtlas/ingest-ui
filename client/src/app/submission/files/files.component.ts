import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {IngestService} from "../../shared/ingest.service";

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  @Input() submissionEnvelopeId;
  @Input() submissionEnvelope;
  uploadDetails: Object;

  files$ : Observable<Object[]>;

  constructor(private ingestService: IngestService) { }

  ngOnInit() {
    this.files$ = this.ingestService.getAllFiles(this.submissionEnvelopeId);
    // this.uploadDetails = this.submissionEnvelope['stagingDetails'];
    console.log(this.uploadDetails)
    console.log('upload details')
  }

}
