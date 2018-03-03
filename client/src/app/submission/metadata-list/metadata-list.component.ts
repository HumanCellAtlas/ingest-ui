import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ViewChild, AfterViewChecked, OnDestroy
} from '@angular/core';
import {IngestService} from "../../shared/services/ingest.service";
import {Observable} from "rxjs/Observable";
import {FlattenService} from "../../shared/services/flatten.service";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Page, PagedData} from "../../shared/models/page";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-metadata-list',
  templateUrl: './metadata-list.component.html',
  styleUrls: ['./metadata-list.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class MetadataListComponent implements OnInit, AfterViewChecked, OnDestroy{
  pollingSubscription: Subscription;
  pollingTimer: Observable<number>;

  @ViewChild('datatable') table: any;

  @Input() metadataList;
  @Input() metadataType;

  @Input() config = {
    displayContent: true,
    displayState: true,
    displayAll: false,
    displayColumns: [],
    hideWhenEmptyRows: false
  };

  private alive: boolean;
  private pollInterval : number;

  metadataList$: Observable<PagedData>;
  @Input() submissionEnvelopeId: string;

  private isLoading: boolean = false;

  editing = {};s

  iconsDir:string;

  page = new Page();

  rows: any[];

  expandAll: boolean;

  isPaginated: boolean;

  constructor(private ingestService: IngestService,
              private flattenService: FlattenService) {
    this.iconsDir = 'assets/open-iconic/svg';
    this.pollInterval = 4000; //4s
    this.alive = true;
    this.page.page = 0;
    this.page.size = 20;
    this.pollingTimer = TimerObservable.create( 0, this.pollInterval)
      .takeWhile(() => this.alive); // only fires when component is alive
  }

  ngOnDestroy(){
    this.alive = false; // switches your IntervalObservable off
  }

  ngOnInit() {
    this.setPage({offset: 0});
  }

  ngAfterViewChecked() {
    // added a flag to keep the rows expanded even after polling refreshes the rows
    if(this.expandAll){
      this.table.rowDetail.expandAllRows();
    }
  }

  getAllColumns(rows){
    let columns = {};

    rows.map(function(row) {
      Object.keys(row).map(function(col){

        columns[col] = '';
      })
    });

    return this.getColumns(columns);
  }

  getColumns(row){
    let columns = [];

    if (this.config && this.config.displayAll){
      columns = Object.keys(row)
        .filter(column => column.match('^(?!validationState).*'));

    } else { // display only fields inside the content object
      columns = Object.keys(row)
        .filter(column => {
          return column.match('^content.(?!core).*') &&
            !column.match('describedBy') &&
            !column.match('schema_version')

        });
    }

    if (this.config && this.config.displayContent) {
      columns.unshift('content.core.type');
    }

    if(this.config && this.config.displayColumns){
      columns = columns.concat(this.config.displayColumns);
    }

    return columns;
  }

  getMetadataType(rowIndex){
    let row = this.metadataList[rowIndex];
    let schemaId = row['content'] ? row['content']['describedBy'] : '';

    if(!schemaId){
      return 'unknown';
    }

    let type = schemaId.split('/').pop();
    this.metadataList[rowIndex]['metadataType'] = type;

    return type;
  }

  getDefaultValidMessage(){
    let validMessage = 'Metadata is valid.';

    if(this.metadataType == 'files'){
      validMessage = 'Data is valid.';
    }

    return validMessage;
  }

  revalidate(rowIndex){
    let metadataLink = this.metadataList[rowIndex]['_links']['self']['href'];

    this.ingestService.patch(metadataLink, {validationState: "Draft"}).subscribe(
      (response) => {
        console.log('patched metadata')
        console.log("Response is: ", response);
      },
      (error) => {
        console.error("An error occurred, ", error);
      });

  }

  updateValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;

    let oldValue = this.rows[rowIndex][cell];
    let newValue = event;

    console.log('newValue', newValue);

    this.rows[rowIndex][cell] = newValue;
    this.rows = [...this.rows];

    console.log('METADATA LIST ROW!', this.metadataList[rowIndex]);
    console.log('ROWS!', this.rows);

  }

  getValidationErrors(row){
    return row['validationErrors[0].user_friendly_message'];
    //TODO retrieve all validation errors
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
    this.table.bodyComponent.bodyHeight = '800px';
    this.table.bodyComponent.recalcLayout();
  }

  expandAllRows(){
    this.table.rowDetail.expandAllRows();
    this.expandAll = true;
  }

  collapseAllRows(){
    this.table.rowDetail.collapseAllRows();
    this.expandAll = false;
  }

  setPage(pageInfo){
    this.stopPolling();
    this.page.page = pageInfo.offset;
    this.startPolling(pageInfo);
    this.alive = true;
  }

  fetchData(pageInfo){
    if(this.submissionEnvelopeId){
      let newPage = new Page();
      newPage['page'] = pageInfo['offset'];
      newPage['size'] = pageInfo['size'];

      this.metadataList$ = this.ingestService.fetchSubmissionData( this.submissionEnvelopeId, this.metadataType, newPage);

      this.metadataList$.subscribe(data => {
        this.rows = data.data.map(this.flattenService.flatten);
        this.metadataList = data.data;
        if(data.page){
          this.isPaginated = true;
          this.page = data.page;
        } else {
          this.isPaginated = false;
        }
      })
    }
  }

  startPolling(pageInfo){
    this.pollingSubscription = this.pollingTimer.subscribe(() => {
      this.fetchData(pageInfo);
    });

  }

  stopPolling(){
    if(this.pollingSubscription){
      this.pollingSubscription.unsubscribe();
    }
  }

}
