import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ViewChild, AfterViewChecked, OnDestroy
} from '@angular/core';
import {IngestService} from "../../shared/services/ingest.service";
import {FlattenService} from "../../shared/services/flatten.service";
import {Page, PagedData} from "../../shared/models/page";
import {Observable, Subscription} from "rxjs/Rx";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import "rxjs-compat/add/operator/takeWhile";

@Component({
  selector: 'app-metadata-list',
  templateUrl: './metadata-list.component.html',
  styleUrls: ['./metadata-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MetadataListComponent implements OnInit, AfterViewChecked, OnDestroy{
  pollingSubscription: Subscription;
  pollingTimer: Observable<number>;

  @ViewChild('datatable') table: any;

  @Input() metadataList;
  @Input() metadataType;
  @Input() expectedCount;

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

  editing = {};

  iconsDir:string;

  page = new Page();

  rows: any[];

  expandAll: boolean;

  isPaginated: boolean;

  validationStates: string[];

  filterState: string;

  currentPageInfo: {};

  constructor(private ingestService: IngestService,
              private flattenService: FlattenService) {
    this.iconsDir = 'assets/open-iconic/svg';
    this.pollInterval = 4000; //4s
    this.alive = true;
    this.page.page = 0;
    this.page.size = 20;
    this.pollingTimer = TimerObservable.create( 0, this.pollInterval)
      .takeWhile(() => this.alive); // only fires when component is alive

    this.validationStates = ['Draft', 'Validating', 'Valid', 'Invalid']
  }

  ngOnDestroy(){
    this.alive = false; // switches your TimerObservable off
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
          return (column.match('^content.(?!core).*') &&
            !column.match('describedBy') &&
            !column.match('schema_version') &&
            !column.match('[\[]') ) // exclude metadata attributes which are of list type
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
    let newValue = event.target.value;

    console.log('newValue', newValue);

    this.rows[rowIndex][cell] = newValue;
    this.rows = [...this.rows];

    console.log('METADATA LIST ROW!', this.metadataList[rowIndex]);
    console.log('ROWS!', this.rows);
  }

  getValidationErrors(row){
    let columns = Object.keys(row)
      .filter(column => {
        return (column.match('^validationErrors.+userFriendlyMessage'))
      });
    let errors = []
    let count = columns.length
    for(let i = 0; i < count; i++){
      errors.push(`* ${row[columns[i]]}`)
    }
    return errors;
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
    this.currentPageInfo = pageInfo;
    this.stopPolling();
    this.page.page = pageInfo.offset;
    this.startPolling(this.currentPageInfo);
    this.alive = true;
  }


  fetchData(pageInfo){

    if(this.submissionEnvelopeId){
      let newPage = new Page();
      newPage['page'] = pageInfo['offset'];
      newPage['size'] = pageInfo['size'];
      newPage['sort'] = pageInfo['sort'];

      this.metadataList$ = this.ingestService.fetchSubmissionData( this.submissionEnvelopeId, this.metadataType, this.filterState, newPage);
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

  filterByState(event) {
    let filterState = event.value;
    this.filterState = filterState;
    this.setPage(this.currentPageInfo);
  }

  showFilterState(){
    return this.metadataType != 'bundleManifests'
  }

  onSort(event){
    let sorts = event.sorts

    let column = sorts[0]['prop']; // only one column sorting is supported for now
    let dir = sorts[0]['dir'];

    if(this.metadataType === 'files' ) { // only sorting in files are supported for now
      this.currentPageInfo['sort'] = {column: column, dir:dir}
      this.setPage(this.currentPageInfo);
    }

  }
}
