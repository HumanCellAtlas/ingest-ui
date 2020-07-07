import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IngestService} from '../shared/services/ingest.service';
import {Project} from '../shared/models/project';
import {TimerObservable} from 'rxjs-compat/observable/TimerObservable';
import {tap} from 'rxjs/operators';
import {AaiService} from '../aai/aai.service';
import {Profile} from 'oidc-client';
import {MatPaginator, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit, OnDestroy, AfterViewInit {
  userInfo: Profile;
  projects: Project[];
  alive: boolean;
  interval: number;

  pagination: Object;
  params: Object;
  currentPageInfo: Object;

  // MatPaginator Inputs
  pageSizeOptions: number[] = [5, 10, 20, 30];

  // MatPaginator Output
  pageEvent: PageEvent;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private aai: AaiService, private ingestService: IngestService) {

    this.alive = true;
    this.interval = 4000;

    this.currentPageInfo = {
      size: 20,
      number: 0,
      totalPages: 0,
      totalElements: 0,
      start: 0,
      end: 0
    };
    this.params = {'page': 0, 'size': 20, 'sort': 'updateDate,desc'};
  }

  ngOnInit() {
    this.aai.getUserInfo().subscribe(profile => {
      this.userInfo = profile;
    });
    this.pollProjects();
  }

  getProjectId(project) {
    let links: any;
    links = project['_links'];
    return links && links['self'] && links['self']['href'] ? links['self']['href'].split('/').pop() : '';
  }

  ngOnDestroy() {
    this.alive = false; // switches your IntervalObservable off
  }

  pollProjects() {
    TimerObservable.create(0, this.interval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        this.getProjects();
      });
  }

  getProjects() {
    this.params['page'] = this.paginator.pageIndex;
    this.params['size'] = this.paginator.pageSize;
    this.ingestService.getUserProjects(this.params)
      .subscribe({
        next: data => {
          this.projects = data._embedded ? data._embedded.projects : [];
          this.pagination = data.page;
          this.getCurrentPageInfo(this.pagination);
        },
        error: err => {
          console.log('err', err);
        }
      });
  }

  // TODO Create a component which supports dynamic(polled data) datatable loading and pagination
  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => this.getProjects())
      )
      .subscribe();
  }

  getCurrentPageInfo(pagination) {
    this.currentPageInfo['totalPages'] = pagination.totalPages;
    this.currentPageInfo['totalElements'] = pagination.totalElements;
    this.currentPageInfo['number'] = pagination.number;
    return this.currentPageInfo;
  }
}
