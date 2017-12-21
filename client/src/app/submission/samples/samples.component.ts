import {Component, Input, OnInit} from '@angular/core';
import {IngestService} from "../../shared/ingest.service";
import {ListResult} from "../../shared/models/hateoas";
import {Metadata} from "../../shared/models/metadata";

@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.css']
})

export class SamplesComponent implements OnInit {
  @Input() submissionEnvelopeId: number;
  samples : Object[];

  sampleDisplayColumns: string[];
  pagination: Object[]
  params: Object;
  currentPageInfo: Object;
  flattenedSamples: Object[];

  constructor(private ingestService: IngestService) {
    this.params ={'page': 0, 'size': 10, 'sort' : 'submissionDate,desc'};
    this.currentPageInfo = {
      size: 10,
      number: 0,
      totalPages:0,
      totalElements: 0,
      start: 0,
      end:0
    };
    this.sampleDisplayColumns = [
      'content.derived_from'
    ];

  }

  ngOnInit() {
    this.getSamples();
  }

  submit(){
    console.log('submit xls file.')
  }

  getSamples(){
    this.ingestService.getSamples(this.submissionEnvelopeId, this.params)
      .subscribe(data =>{
        this.samples = data["_embedded"] ? data["_embedded"].samples : [];
        this.flattenedSamples = this.samples.map(this.flatten);
        console.log(this.flattenedSamples);
        this.pagination = data["page"];
        let p = this.getCurrentPageInfo(this.pagination)
        console.log(p);
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
  }

  goToPage(number){
    this.params['page'] = number;
    this.getSamples();
  }

  //TODO: create a currentPageInfo obj initialized with page from HAL response
  getCurrentPageInfo(pagination){
    this.currentPageInfo['totalPages'] = pagination.totalPages;
    this.currentPageInfo['totalElements'] = pagination.totalElements;
    this.currentPageInfo['number'] = pagination.number;
    this.currentPageInfo['start'] = ((pagination.number) * pagination.size) + 1;

    let numberTimesSize = (pagination.number+1) * pagination.size;
    this.currentPageInfo['end'] = numberTimesSize;
    if(pagination.number == (this.currentPageInfo['totalPages'] -1) ){
      this.currentPageInfo['end'] = this.currentPageInfo['totalElements'];
    }

    return this.currentPageInfo;
  }

}
