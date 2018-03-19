import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IngestService} from '../../shared/services/ingest.service';
import {Observable} from "rxjs/Observable";
import {SubmissionEnvelope} from "../../shared/models/submissionEnvelope";
import {ListResult} from "../../shared/models/hateoas";
import {ActivatedRoute, Router} from "@angular/router";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import 'rxjs/add/operator/takeWhile';
import {AlertService} from "../../shared/services/alert.service";

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SubmissionListComponent implements OnInit {

  submissionEnvelopes$: Observable<SubmissionEnvelope[]>;

  submissionProjects: Object;

  submissionEnvelopes: SubmissionEnvelope[];
  pagination: Object;
  links: Object;
  currentPageInfo: Object;
  params: Object;

  interval: number;

  private alive: boolean;

  private showAll;

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
    };

    this.submissionProjects = {};

    this.params ={'page': 0, 'size': 20, 'sort' : 'submissionDate,desc'};

    route.params.subscribe(val => {
      this.showAll = this.route.snapshot.paramMap.get('all');
    });
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
    this.alertService.success("",'You have successfully submitted your submission envelope.');

  }

  pollSubmissions() {
    TimerObservable.create(0, this.interval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        this.getSubmissions();
      });
  }

  getSubmissions(){
    if(this.showAll){
      this.ingestService.getAllSubmissions(this.params)
        .subscribe(data =>{
          let submissions = data._embedded ? data._embedded.submissionEnvelopes : [];
          this.submissionEnvelopes = submissions;
          this.pagination = data.page;
          this.links = data._links;
          this.getCurrentPageInfo(this.pagination);
          this.initSubmissionProjects(submissions);
        });

    }
    else{
      this.ingestService.getUserSubmissions(this.params)
        .subscribe(data =>{
          let submissions = data._embedded ? data._embedded.submissionEnvelopes : [];
          this.submissionEnvelopes = submissions;
          this.pagination = data.page;
          this.links = data._links;
          this.getCurrentPageInfo(this.pagination);
          this.initSubmissionProjects(submissions);
        });

    }
  }

  initSubmissionProjects(submissions){
    for(let submission of submissions){
      let submissionId = this.getSubmissionId(submission);

      if(this.submissionProjects[submissionId] == undefined){
        this.submissionProjects[submissionId] = '';
        this.ingestService.getSubmissionProject(submissionId)
          .subscribe(data => {
            this.submissionProjects[submissionId] = {};
            this.submissionProjects[submissionId]['name'] = this.extractProjectName(data);
            this.submissionProjects[submissionId]['id'] = this.extractProjectId(data);
          })
      }
    }
  }

  getProjectName(submission){
    return this.submissionProjects[this.getSubmissionId(submission)]['name'];
  }
  getProjectId(submission){
    return this.submissionProjects[this.getSubmissionId(submission)]['id'];
  }

  extractProjectName(project){
    let content = project['content'];
    return content ? project['content']['project_core']['project_title'] : '';
  }

  extractProjectId(project){
    let content = project['content'];
    return content ? project['content']['project_core']['project_shortname'] : '';
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

  toggleShowAll(value){
    console.log(value)
    this.showAll = value;
  }
}


