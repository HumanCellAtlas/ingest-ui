import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
  ViewChild, AfterViewChecked
} from '@angular/core';

export class Page {
  //The number of elements in the page
  size: number = 0;
  //The total number of elements
  totalElements: number = 10;
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
  @Output() pageNumberChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() config = {
    displayContent: true,
    displayState: true,
    displayAll: false,
    displayColumns: []
  };

  private isLoading: boolean = false;

  editing = {};

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  expanded: any = {};
  timeout: any;

  iconsDir:string;

  page = new Page();

  rows: any[];

  expandAll: boolean;

  constructor() {
    this.iconsDir = 'assets/open-iconic/svg';
    this.setPage({ offset: 0 });
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
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

    columns.unshift('content.core.type');

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
    //   .filter(column => column.match('^validationErrors\[\d\]\.user_friendly_message.*'));
    // return userFriendlyErrors.join(',');
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    console.log(this.table);
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
    this.pageNumberChange.emit(pageInfo.offset);
    this.rows = this.metadataList;
  }

  flatten(data) {
    let result = {};

    function recurse(cur, prop) {
      if (Object(cur) !== cur) {
        result[prop] = cur;
      } else if (Array.isArray(cur)) {
        for (var i = 0, l = cur.length; i < l; i++)
          recurse(cur[i], prop + "[" + i + "]");
        if (l == 0) result[prop] = [];
      } else {
        let isEmpty = true;
        for (let p in cur) {
          isEmpty = false;
          recurse(cur[p], prop ? prop + "." + p : p);
        }
        if (isEmpty && prop) result[prop] = {};
      }
    }
    recurse(data, "");
    return result;
  };

}
