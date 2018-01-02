import {Component, Input, OnInit} from '@angular/core';
import {IngestService} from "../../shared/services/ingest.service";
import {TimerObservable} from "rxjs/observable/TimerObservable";

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css']
})
export class MetadataComponent implements OnInit {
  @Input() submissionEnvelopeId: number;
  @Input() projectId: number;

  analyses: Object[];
  assays: Object[];
  bundles: Object[];
  protocols: Object[];
  samples: Object[];

  private alive: boolean;
  private pollInterval : number;

  constructor(private ingestService: IngestService) {
    this.pollInterval = 4000; //4s
    this.alive = true;
  }

  ngOnInit() {
    this.pollMetadata();
  }

  ngOnDestroy(){
    this.alive = false; // switches your IntervalObservable off
  }

  pollMetadata(){
    TimerObservable.create(0, this.pollInterval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        if(this.submissionEnvelopeId){
          this.ingestService.getSamples(this.submissionEnvelopeId)
            .subscribe(data => this.samples = data.map(this.flatten));
          this.ingestService.getAnalyses(this.submissionEnvelopeId)
            .subscribe(data => this.analyses = data.map(this.flatten));
          this.ingestService.getAssays(this.submissionEnvelopeId)
            .subscribe(data => this.assays = data.map(this.flatten));
          this.ingestService.getProtocols(this.submissionEnvelopeId)
            .subscribe(data => this.protocols = data.map(this.flatten));
          this.ingestService.getBundles(this.submissionEnvelopeId)
            .subscribe(data => this.bundles = data.map(this.flatten));
        }
      });
  }

  flatten(data) {
    let result = {};

    function recurse(cur, prop) {
      if (Object(cur) !== cur) {
        result[prop] = cur;
      } else if (Array.isArray(cur)) {
        for (var i = 0, l = cur.length; i < l; i++)
          recurse(cur[i], prop + "[" + i + "]");
        if (l == 0) result[prop] = [];
      } else {
        let isEmpty = true;
        for (let p in cur) {
          isEmpty = false;
          recurse(cur[p], prop ? prop + "." + p : p);
        }
        if (isEmpty && prop) result[prop] = {};
      }
    }
    recurse(data, "");
    return result;
  };

  submit(){
    console.log('submit');
  }

}
