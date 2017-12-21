import {Component, Input, OnInit} from '@angular/core';
import {IngestService} from "../../shared/ingest.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  @Input() projectId;
  @Input() submissionEnvelopeId;
  @Input() project;

  constructor(private ingestService: IngestService, private route: ActivatedRoute) { }

  ngOnInit(){
  }



}
