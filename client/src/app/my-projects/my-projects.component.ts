import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IngestService} from '../shared/services/ingest.service';
import {Project, ProjectColumn} from '../shared/models/project';
import {TimerObservable} from 'rxjs-compat/observable/TimerObservable';
import {concatMap, tap} from 'rxjs/operators';
import {AaiService} from '../aai/aai.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Observable, of} from "rxjs";
import {Account} from "../core/account";

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit, OnDestroy, AfterViewInit {
  account$: Observable<Account>;
  isLoggedIn$: Observable<Boolean>;
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
    this.isLoggedIn$ = this.aai.isUserLoggedIn();
    this.account$ = this.isLoggedIn$.pipe(
      concatMap(loggedIn => {
        if (loggedIn) {
          return this.ingestService.getUserAccount();
        }
        return of(undefined);
      })
    );
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
          this.introduction = "These are your assigned projects.";
          this.columns = [
            ProjectColumn.api_link,
            ProjectColumn.short_name,
            ProjectColumn.project_title,
            ProjectColumn.primary_contributor,
            ProjectColumn.last_updated
          ];
        } else {
          this.introduction = "These are your projects created for the Human Cell Atlas.";
          this.columns = [
            ProjectColumn.short_name,
            ProjectColumn.project_title,
            ProjectColumn.last_updated
          ];
        }
      },
      error: err => {
        console.log('err', err);
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
