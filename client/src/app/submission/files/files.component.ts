import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {IngestService} from "../../shared/services/ingest.service";
import {SubmissionEnvelope} from "../../shared/models/submissionEnvelope";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {FlattenService} from "../../shared/services/flatten.service";

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  @Input() submissionEnvelopeId;
  @Input() submissionEnvelope;
  @Input() files$;
  @Input() manifest;

  files : Object[];

  config: Object;

  constructor() {
  }

  ngOnInit() {
    this.config = {
      displayContent: true,
      displayState: true,
      displayAll: false,
      displayColumns:[
        'cloudUrl'
      ]
    };
  }

}
