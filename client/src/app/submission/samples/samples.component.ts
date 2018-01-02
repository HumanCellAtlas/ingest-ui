import {Component, Input, OnInit} from '@angular/core';
import {IngestService} from "../../shared/services/ingest.service";
import {ListResult} from "../../shared/models/hateoas";
import {Metadata} from "../../shared/models/metadata";

@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.css']
})

export class SamplesComponent implements OnInit {
  @Input() samples : Object[];

  constructor(private ingestService: IngestService) {

  }
  ngOnInit() {

  }
}
