import {Component, Input, OnInit} from '@angular/core';
import {IngestService} from "../../shared/services/ingest.service";

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

  constructor(private ingestService: IngestService) {

  }

  ngOnInit() {
    if(this.submissionEnvelopeId){
      this.ingestService.getAnalyses(this.submissionEnvelopeId)
        .subscribe(data => this.analyses = data);
      this.ingestService.getAssays(this.submissionEnvelopeId)
        .subscribe(data => this.assays = data.map(this.flatten));
      this.ingestService.getProtocols(this.submissionEnvelopeId)
        .subscribe(data => this.protocols = data.map(this.flatten));
      this.ingestService.getBundles(this.submissionEnvelopeId)
        .subscribe(data => this.bundles = data.map(this.flatten));

    }
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
