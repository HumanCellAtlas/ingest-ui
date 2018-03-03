import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {of} from "rxjs/observable/of";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {catchError, finalize, tap} from "rxjs/operators";

import {MatPaginator} from "@angular/material/paginator";

import {Page, PagedData} from "../../shared/models/page";

import {IngestService} from "../../shared/services/ingest.service";
import {SchemaService} from "../../shared/services/schema.service";
import {FlattenService} from "../../shared/services/flatten.service";


@Component({
  selector: 'app-metadata-table',
  templateUrl: './metadata-table.component.html',
  styleUrls: ['./metadata-table.component.css']
})

export class MetadataTableComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() submissionEnvelopeId: string;
  @Input() metadataEntity: string;
  @Input() metadataEntityType: string;

  POLLING_INTERVAL_MS: number = 4000;
  DEFAULT_PAGE_SIZE = 10;
  PAGE_OPTIONS = [5, 10, 20];

  pollingSubscription: Subscription;
  pollingTimer: Observable<number>;
  alive:boolean = false;

  metadataCount$: Observable<number>;
  rows$: Observable<object[]>;

  dataSource: MetadataDataSource;

  contentColumnMap: object[];
  contentColumns: string[];
  ingestColumns: string[];
  displayedColumns: string[];

  constructor(
    private ingestService: IngestService,
    private schemaService: SchemaService,
    private flattenService: FlattenService
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    // this.alive = true;
    this.dataSource = new MetadataDataSource(this.ingestService, this.flattenService, this.schemaService);

    this.metadataCount$ = this.dataSource.getMetadataCount();
    this.rows$ = this.dataSource.getMetadataRows();

    this.loadMetadataPage();

    this.pollingTimer = TimerObservable.create( 0, this.POLLING_INTERVAL_MS)
      .takeWhile(() => this.alive); // only fires when component is alive

    this.pollingSubscription = this.pollingTimer.subscribe(() => {
      this.loadMetadataPage();
    });

    this.ingestColumns = [];
    this.contentColumns = [];

    this.rows$.subscribe(
      rows => {
        let columns = {};

        rows.map(function(row) {
          Object.keys(row).map(function(col){
            columns[col] = '';
          })
        });

        this.displayedColumns = Object.keys(columns);
      }
    )

  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => this.loadMetadataPage())
      )
      .subscribe();

  }

  ngOnDestroy(){
    this.alive = false; // switches your IntervalObservable off
  }

  loadMetadataPage() {
    this.dataSource.loadMetadata(
      this.submissionEnvelopeId,
      this.metadataEntity,
      this.metadataEntityType,
      '',
      'asc',
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  // template helpers
  getMetadataSubType(row){
    return row['content.describedBy'].split('/').pop();
  }

  getUserFriendlyName(column){
    let userFriendlyName = 'todo';
    return userFriendlyName;
  }

  // event handlers
  onValueChange(event){
    console.log('onValueChange', event);
  }
}

export class MetadataDataSource implements DataSource<object> {
  DEFAULT_PAGE_SIZE = 10;

  private metadataSubject = new BehaviorSubject<object[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private metadataCountSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private ingestService: IngestService, private flattenService: FlattenService, private schemaService) {}

  connect(): Observable<object[]> {
    return this.metadataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.metadataSubject.complete();
    this.loadingSubject.complete();
  }

  loadMetadata(submissionId: string,
               metadataEntity: string,
               metadataEntityType: string,
               filter = '',
               sortDirection = 'asc',
               pageIndex = 0,
               pageSize = this.DEFAULT_PAGE_SIZE) {

    // TODO make spinner display not too distracting
    // this.loadingSubject.next(true);

    let pageParams = new Page();
    pageParams['page'] = pageIndex;
    pageParams['size'] = pageSize;

    this.ingestService.fetchSubmissionData(submissionId, metadataEntity, pageParams).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(data => {
      let rows = [];
      let pagedData = <PagedData> data;

      for(let m of pagedData.data || []){

        // let row = this.flattenService.flatten(m['content']);
        //
        // row['validationState'] = m['validationState'];
        // let rowEntityType = row['describedBy'].split('/').pop();
        //
        // if(metadataEntityType && (metadataEntityType == rowEntityType)){ //if has same schema
        //   rows.push(row);
        // }

        let row = this.flattenService.flatten(m);
        rows.push(row);


      }

      this.metadataCountSubject.next(pagedData.page.totalElements);
      this.metadataSubject.next(rows);
      // console.log('rows', rows);
    });
  }

  getMetadataCount(){
    return this.metadataCountSubject.asObservable();
  }

  getMetadataRows(){
    return this.metadataSubject.asObservable();
  }

}
