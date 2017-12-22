import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IngestService} from '../../shared/ingest.service';
import {Observable} from "rxjs/Observable";
import {SubmissionEnvelope} from "../../shared/models/submissionEnvelope";
import {ListResult} from "../../shared/models/hateoas";
import {ActivatedRoute, Router} from "@angular/router";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import 'rxjs/add/operator/takeWhile';
import {AlertService} from "../../shared/alert.service";

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SubmissionListComponent implements OnInit {

  submissionEnvelopes$: Observable<SubmissionEnvelope[]>;
  submissionEnvelopes: SubmissionEnvelope[];
  pagination: Object;
  links: Object;
  currentPageInfo: Object;
  params: Object;

  interval: number;

  private alive: boolean;

  constructor(private ingestService: IngestService,
              private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService
  ) {
    this.alive = true;
    this.interval = 10000;
    this.currentPageInfo = {
      size: 20,
      number: 0,
      totalPages:0,
      totalElements: 0,
      start: 0,
      end:0
    }

    this.params ={'page': 0, 'size': 20, 'sort' : 'submissionDate,desc'};
  }

  ngOnInit() {
    this.pollSubmissions()

  }

  ngOnDestroy(){
    this.alive = false; // switches your IntervalObservable off
  }

  getSubmitLink(submissionEnvelope){
    let links = submissionEnvelope['_links'];
    return links && links['submit']? links['submit']['href'] : null;
  }

  getSubmissionId(submissionEnvelope){
    let links = submissionEnvelope['_links'];
    return links && links['self'] && links['self']['href'] ? links['self']['href'].split('/').pop() : '';
  }

  completeSubmission(submissionEnvelope) {
    let submitLink = this.getSubmitLink(submissionEnvelope);
    this.ingestService.submit(submitLink);
    this.alertService.success('You have successfully submitted your submission envelope.');
    console.log('completeSubmission');
  }

  pollSubmissions() {
    TimerObservable.create(0, this.interval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        this.getSubmissions();
      });
  }

  getSubmissions(){
    this.ingestService.getUserSubmissions(this.params)
    // this.ingestService.getAllSubmissions(this.params)
      .subscribe(data =>{
        let submissions = data._embedded ? data._embedded.submissionEnvelopes : [];
        this.submissionEnvelopes = submissions;
        this.pagination = data.page;
        this.links = data._links;
        this.getCurrentPageInfo(this.pagination);
        console.log(this.getCurrentPageInfo(this.pagination));
      });
  }

  getCurrentPageInfo(pagination){
    this.currentPageInfo['totalPages'] = pagination.totalPages;
    this.currentPageInfo['totalElements'] = pagination.totalElements;
    this.currentPageInfo['number'] = pagination.number;
    this.currentPageInfo['start'] = ((pagination.number) * pagination.size) + 1;
    let numberTimesSize = (pagination.number+1) * pagination.size;
    let lastPageTotalElements = (numberTimesSize % pagination.totalElements);
    this.currentPageInfo['end'] = numberTimesSize - (lastPageTotalElements % pagination.size);
    return this.currentPageInfo;
  }

  goToPage(pageNumber){
    this.params['page'] = pageNumber;
    this.getSubmissions();
  }

  createRange(number){
    let items: number[] = [];
    for(let i = 0; i < number; i++){
      items.push(i);
    }
    return items;
  }
}


