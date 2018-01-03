import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ViewChild, AfterViewChecked
} from '@angular/core';
import {IngestService} from "../../shared/services/ingest.service";
import {Observable} from "rxjs/Observable";
import {FlattenService} from "../../shared/services/flatten.service";
import {TimerObservable} from "rxjs/observable/TimerObservable";

export class Page {
  //The number of elements in the page
  size: number = 0;
  //The total number of elements
  totalElements: number = 0;
  //The total number of pages
  totalPages: number = 0;
  //The current page number
  pageNumber: number = 0;

}

@Component({
  selector: 'app-metadata-list',
  templateUrl: './metadata-list.component.html',
  styleUrls: ['./metadata-list.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class MetadataListComponent implements OnInit, AfterViewChecked{
  @ViewChild('mydatatable') table: any;

  @Input() metadataList;
  @Input() metadataType;

  @Input() config = {
    displayContent: true,
    displayState: true,
    displayAll: false,
    displayColumns: []
  };

  private alive: boolean;
  private pollInterval : number;

  metadataList$: Observable<Object[]>;
  @Input() submissionEnvelopeId: string;

  private isLoading: boolean = false;

  editing = {};s

  iconsDir:string;

  page = new Page();

  rows: any[];

  expandAll: boolean;

  constructor(private ingestService: IngestService,
              private flattenService: FlattenService) {
    this.iconsDir = 'assets/open-iconic/svg';
    this.pollInterval = 4000; //4s
    this.alive = true;
  }

  ngOnDestroy(){
    this.alive = false; // switches your IntervalObservable off
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
    this.fetchData();
  }

  ngAfterViewChecked() {
    // added a flag to keep the rows expanded even after polling refreshes the rows
    if(this.expandAll){
      this.table.rowDetail.expandAllRows();
    }
  }

  getAllColumns(metadataList){
    let columns = {};

    metadataList.map(function(row) {
      Object.keys(row).map(function(col){
        columns[col] = '';
      })
    });

    return this.getColumns(columns);
  }

  getColumns(metadataListRow){
    let columns = [];

    if (this.config && this.config.displayAll){
      columns = Object.keys(metadataListRow)
        .filter(column => column.match('^(?!validationState).*'));
    } else { // display only fields inside the content object
      columns = Object.keys(metadataListRow)
        .filter(column => column.match('^content.(?!core).*'));
    }

    if (this.config && this.config.displayContent) {
      columns.unshift('content.core.type');
    }

    if(this.config && this.config.displayColumns){
      columns = columns.concat(this.config.displayColumns);
    }

    // if(this.config.displayState){
    //   columns.unshift('validationState');
    // }

    return columns;
  }

  getMetadataType(row){
    return row['content.donor.is_living'] != undefined ? 'donor' : row['content.core.type'];
  }

  updateValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.metadataList[rowIndex][cell] = event.target.value;
    this.metadataList = [...this.metadataList];
    console.log('UPDATED!', this.metadataList[rowIndex][cell]);
    console.log(this.metadataList[rowIndex]);
  }

  getValidationErrors(row){
    return row['validationErrors[0].user_friendly_message'];
    //TODO retrieve all validation errors, fix the filtering below
    // let userFriendlyErrors = Object.keys(row)
    //   .filter(column => column.match('^validationErrors\[%d\]\.user\_friendly\_message.*'));
    // return userFriendlyErrors.join(',');
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
    this.page.pageNumber = pageInfo.offset;
    this.rows = this.metadataList;
  }

  fetchData(){
    TimerObservable.create(500, this.pollInterval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        if(this.submissionEnvelopeId){
          this.metadataList$ = this.ingestService.fetchData(this.metadataType, this.submissionEnvelopeId);
          this.metadataList$.subscribe(data => {
            this.metadataList = data.map(this.flattenService.flatten)
          })
          // console.log('polling ' + this.metadataType, this.metadataList);
        }
    });
  }

}
