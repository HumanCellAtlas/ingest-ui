import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.scss']
})
export class MetadataComponent implements OnInit {
  @Input() submissionEnvelopeId: number;
  @Input() manifest: Object;

  constructor() {
  }

  ngOnInit() {
  }
}
