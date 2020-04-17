import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {IngestService} from '../shared/services/ingest.service';
import {SubmissionEnvelope} from '../shared/models/submissionEnvelope';
import {ActivatedRoute, Router} from '@angular/router';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

import {AlertService} from '../shared/services/alert.service';
import {tap} from 'rxjs/operators';
import {LoaderService} from '../shared/services/loader.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SubmissionListComponent implements OnInit, OnDestroy, AfterViewInit {
  submissionProjects: Object;

  submissionEnvelopes: SubmissionEnvelope[];
  pagination: Object;
  links: Object;
  currentPageInfo: Object;
  params: Object;

  interval: number;

  private alive: boolean;

  private showAll;

  pageFromUrl;

  pollingSubscription: Subscription;


  // MatPaginator Inputs
  pageSizeOptions: number[] = [5, 10, 20, 30];

  // MatPaginator Output
  pageEvent: PageEvent;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private ingestService: IngestService,
              private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private loaderService: LoaderService
  ) {
    this.alive = true;
    this.interval = 10000;
    this.currentPageInfo = {
      size: 20,
      number: 0,
      totalPages: 0,
      totalElements: 0,
      start: 0,
      end: 0
    };

    this.submissionProjects = {};

    this.params = {'page': 0, 'size': 20, 'sort' : 'submissionDate,desc'};

    route.params.subscribe(val => {
      this.showAll = this.route.snapshot.paramMap.get('all');
      this.resetPolling();
    });
  }

  ngOnInit() {
    this.pollSubmissions();
  }

  ngOnDestroy() {
    this.alive = false; // switches your IntervalObservable off
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => this.loadSubmissions())
      )
      .subscribe();
  }

  loadSubmissions() {
    this.resetPolling();
  }

  getSubmitLink(submissionEnvelope) {
    const links = submissionEnvelope['_links'];
    return links && links['submit'] ? links['submit']['href'] : null;
  }

  getSubmissionId(submissionEnvelope) {
    const links = submissionEnvelope['_links'];
    return links && links['self'] && links['self']['href'] ? links['self']['href'].split('/').pop() : '';
  }

  getSubmissionUuid(submissionEnvelope) {
    return submissionEnvelope['uuid']['uuid'];
  }

  completeSubmission(submissionEnvelope) {
    const submitLink = this.getSubmitLink(submissionEnvelope);
    this.ingestService.submit(submitLink);
    this.alertService.success('', 'You have successfully submitted your submission envelope.');

  }

  resetPolling() {
    this.stopPolling();
    this.pollSubmissions();
  }

  stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  pollSubmissions() {
    this.pollingSubscription = TimerObservable.create(0, this.interval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        this.getSubmissions();
      });
  }

  getSubmissions() {
    this.params['page'] = this.paginator.pageIndex;
    this.params['size'] = this.paginator.pageSize;


    if (this.showAll) {
      this.ingestService.getAllSubmissions(this.params)
        .subscribe(data => {
          const submissions = data._embedded ? data._embedded.submissionEnvelopes : [];
          this.submissionEnvelopes = submissions;
          this.pagination = data.page;
          this.links = data._links;
          this.getCurrentPageInfo(this.pagination);
          this.initSubmissionProjects(submissions);
        });

    } else {
      this.ingestService.getUserSubmissions(this.params)
        .subscribe(data => {
          const submissions = data._embedded ? data._embedded.submissionEnvelopes : [];
          this.submissionEnvelopes = submissions;
          this.pagination = data.page;
          this.links = data._links;
          this.getCurrentPageInfo(this.pagination);
          this.initSubmissionProjects(submissions);
        });

    }

  }

  initSubmissionProjects(submissions) {
    for (const submission of submissions) {
      const submissionId = this.getSubmissionId(submission);

      if (this.submissionProjects[submissionId] == undefined) {
        this.submissionProjects[submissionId] = '';
        this.ingestService.getSubmissionProject(submissionId)
          .subscribe(data => {
            this.submissionProjects[submissionId] = {};
            this.submissionProjects[submissionId]['name'] = this.extractProjectName(data);
            this.submissionProjects[submissionId]['id'] = this.extractProjectId(data);
          });
      }
    }
  }

  getProjectName(submission) {
    return this.submissionProjects[this.getSubmissionId(submission)]['name'];
  }
  getProjectId(submission) {
    return this.submissionProjects[this.getSubmissionId(submission)]['id'];
  }

  extractProjectName(project) {
    const content = project ? project['content'] : null;
    return content ? project['content']['project_core']['project_title'] : '';
  }

  extractProjectId(project) {
    const content = project ? project['content'] : null;
    return content ? project['content']['project_core']['project_short_name'] : '';
  }

  getCurrentPageInfo(pagination) {
    this.currentPageInfo['totalPages'] = pagination.totalPages;
    this.currentPageInfo['totalElements'] = pagination.totalElements;
    this.currentPageInfo['number'] = pagination.number;
    return this.currentPageInfo;
  }

  onDeleteSubmission(submissionEnvelope: SubmissionEnvelope) {
    const submissionId: String = this.getSubmissionId(submissionEnvelope);
    const projectName = this.getProjectName(submissionEnvelope);
    const projectInfo = projectName ? `(${projectName})` : '';
    const submissionUuid = submissionEnvelope['uuid']['uuid'];
    const message = `Are you sure you want to delete the submission with UUID ${submissionUuid} ${projectInfo} ?`;
    const messageOnSuccess = `The submission with UUID ${submissionUuid} ${projectInfo} was deleted!`;
    const messageOnError = `An error has occurred while deleting the submission w/UUID ${submissionUuid} ${projectInfo}`;

    if (confirm(message)) {
      this.loaderService.display(true);
      this.ingestService.deleteSubmission(submissionId).subscribe(
        data => {
          this.alertService.clear();
          this.alertService.success('', messageOnSuccess);
          this.loadSubmissions();
          this.loaderService.display(false);
        },
        err => {
          this.alertService.clear();
          this.alertService.error(messageOnError, err.error.message);
          console.log('error deleting submission', err);
          this.loaderService.display(false);
        });
    }
  }
}


