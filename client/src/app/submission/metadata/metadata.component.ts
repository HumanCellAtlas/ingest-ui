import {Component, Input, OnInit} from '@angular/core';
import {IngestService} from "../../shared/services/ingest.service";
import {TimerObservable} from "rxjs/observable/TimerObservable";

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.scss']
})
export class MetadataComponent implements OnInit {
  @Input() submissionEnvelopeId: number;
  @Input() projectId: number;

  @Input() analyses: Object[];
  @Input() assays: Object[];
  @Input() protocols: Object[];
  @Input() samples: Object[];

  private alive: boolean;
  private pollInterval : number;

  constructor(private ingestService: IngestService) {
    this.pollInterval = 4000; //4s
    this.alive = true;
  }

  ngOnInit() {

  }

  ngOnDestroy(){
    this.alive = false; // switches your IntervalObservable off
  }


  submit(){
    console.log('submit');
  }

}
