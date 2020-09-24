import {Component, Input, OnInit} from '@angular/core';

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

  files: Object[];

  config: Object;

  constructor() {
  }

  ngOnInit() {
    this.config = {
      displayContent: true,
      displayState: true,
      displayAll: false,
      displayColumns: [
        'cloudUrl'
      ]
    };
  }

}
