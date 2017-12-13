import {Component, Input, OnInit} from '@angular/core';
import {IngestService} from "../../shared/ingest.service";

@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.css']
})
export class SamplesComponent implements OnInit {
  @Input() submissionEnvelopeId: number;
  samples : Object[];
  pagination: Object[]
  params: Object;
  currentPageInfo: Object;

  constructor(private ingestService: IngestService) {

    this.params ={'page': 0, 'size': 10, 'sort' : 'submissionDate,desc'};
    this.currentPageInfo = {
      size: 10,
      number: 0,
      totalPages:0,
      totalElements: 0,
      start: 0,
      end:0
    }
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
        this.pagination = data["page"];
        let p = this.getCurrentPageInfo(this.pagination)
        console.log(p);
      });
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
