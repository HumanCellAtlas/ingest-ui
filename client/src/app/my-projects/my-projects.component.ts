import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Observable, timer} from 'rxjs';
import {takeWhile, tap} from 'rxjs/operators';
import {AaiService} from '../aai/aai.service';
import {IngestService} from '../shared/services/ingest.service';
import {Project, ProjectColumn} from '../shared/models/project';
import {Account} from '../core/account';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit, OnDestroy, AfterViewInit {
  account$: Observable<Account>;
  isWrangler: Boolean;
  introduction: String;
  columns: ProjectColumn[];

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
    // protected against null user by the user-is-logged-in guard
    this.account$ = this.ingestService.getUserAccount();
    this.pollAccount();
    this.pollProjects();
  }

  ngOnDestroy() {
    this.alive = false; // switches your IntervalObservable off
  }

  private pollAccount() {
    this.account$.subscribe({
      next: data => {
        this.isWrangler = data.isWrangler();
        if (this.isWrangler) {
          this.introduction = 'These are your assigned projects.';
          this.columns = [
            ProjectColumn.api_link,
            ProjectColumn.short_name,
            ProjectColumn.project_title,
            ProjectColumn.primary_contributor,
            ProjectColumn.last_updated
          ];
        } else {
          this.introduction = 'These are your projects created for the Human Cell Atlas.';
          this.columns = [
            ProjectColumn.short_name,
            ProjectColumn.project_title,
            ProjectColumn.last_updated
          ];
        }
      }
    });
  }

  pollProjects() {
    timer(0, this.interval)
      .pipe(takeWhile(() => this.alive))// only fires when component is alive
      .subscribe(() => this.getProjects());
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
