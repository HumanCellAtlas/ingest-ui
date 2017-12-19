import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {IngestService} from "../../shared/ingest.service";
import {SubmissionEnvelope} from "../../shared/models/submissionEnvelope";
import {TimerObservable} from "rxjs/observable/TimerObservable";

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  @Input() submissionEnvelopeId;

  files : Object[];

  config = {
    displayContent: true,
    displayState: true,
    displayAll: false
  };

  pollInterval : number;

  private alive: boolean;

  constructor(private ingestService: IngestService) {
    this.alive = true;
  }

  ngOnInit() {
    if(this.submissionEnvelopeId){
      this.pollInterval = 4000; //4s
      this.pollFiles();
    }
  }

  ngOnDestroy(){
    this.alive = false; // switches your IntervalObservable off
  }

  pollFiles(){
    TimerObservable.create(0, this.pollInterval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        this.getFiles();
      });

  }

  getFiles(){
    this.ingestService.getFiles(this.submissionEnvelopeId)
      .subscribe( data => {
        this.files = data.map(this.flatten)
      });
  }

  // TODO: use a service
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
        var isEmpty = true;
        for (var p in cur) {
          isEmpty = false;
          recurse(cur[p], prop ? prop + "." + p : p);
        }
        if (isEmpty && prop) result[prop] = {};
      }
    }
    recurse(data, "");
    return result;
  }

}
