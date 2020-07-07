import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Project, ProjectColumn} from '../shared/models/project';
import {IngestService} from '../shared/services/ingest.service';
import {TimerObservable} from 'rxjs-compat/observable/TimerObservable';
import {tap} from 'rxjs/operators';
import {MatPaginator, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.css']
})
export class AllProjectsComponent implements OnInit, OnDestroy, AfterViewInit {
  projects: Project[];
  columns: ProjectColumn[] = [
    ProjectColumn.api_link,
    ProjectColumn.short_name,
    ProjectColumn.project_title,
    ProjectColumn.primary_contributor,
    ProjectColumn.last_updated
  ];
  isWrangler: Boolean = true;
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

  searchText: string;
  value: any;

  constructor(private ingestService: IngestService) {
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
    this.pollProjects();
  }

  getProjectId(project) {
    let links: any;
    links = project['_links'];
    return links && links['self'] && links['self']['href'] ? links['self']['href'].split('/').pop() : '';
  }

  getProjectUuid(project) {
    return project['uuid'] ? project['uuid']['uuid'] : '';
  }

  ngOnDestroy() {
    this.alive = false; // switches your IntervalObservable off
  }

  queryProjects(text: string, params) {
    const query = [];
    const fields = [
      'content.project_core.project_description',
      'content.project_core.project_title',
      'content.project_core.project_short_name'
    ];

    for (const field of fields) {
      const criteria = {
        'contentField': field,
        'operator': 'REGEX',
        'value': text.replace(/\s+/g, '\\s+')
      };
      query.push(criteria);
    }

    params['operator'] = 'or';
    this.ingestService.queryProjects(query, params)
      .subscribe({
        next: data => {
          this.projects = data._embedded ? data._embedded.projects : [];
          this.pagination = data.page;
          this.getCurrentPageInfo(this.pagination);
        },
        error: err => {
          console.error('err', err);
        }
      });
  }

  getDefaultProjects(params) {
    const query = [{
      'contentField': 'content.project_core.project_title',
      'operator': 'NIN',
      'value': ['SS2 1 Cell Integration Test', '10x 1 Run Integration Test']
    }, {
      'contentField': 'isUpdate',
      'operator': 'IS',
      'value': false
    }];
    params['operator'] = 'and';
    this.ingestService.queryProjects(query, params)
      .subscribe({
        next: data => {
          this.projects = data._embedded ? data._embedded.projects : [];
          this.pagination = data.page;
          this.getCurrentPageInfo(this.pagination);

        },
        error: err => {
          console.error('err', err);
        }
      });
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

    if (this.searchText) {
      this.queryProjects(this.searchText, this.params);
    } else {
      this.getDefaultProjects(this.params);
    }

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


  onKeyEnter(value) {
    this.searchText = value;
    this.paginator.pageIndex = 0;
    this.getProjects();
  }
}
