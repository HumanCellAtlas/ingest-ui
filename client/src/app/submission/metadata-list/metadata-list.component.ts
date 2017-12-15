import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-metadata-list',
  templateUrl: './metadata-list.component.html',
  styleUrls: ['./metadata-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MetadataListComponent implements OnInit {
  @ViewChild('mydatatable') table: any;

  @Input() metadataList;
  @Input() metadataType;

  @Input() config = {
    displayContent: true,
    displayState: true,
    displayAll: false
  };

  editing = {};

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  expanded: any = {};
  timeout: any;

  iconsDir:string;

  constructor() {
    this.iconsDir = 'assets/open-iconic/svg';

  }

  ngOnInit() {
  }

  getColumns(metadataListRow){
    let columns = []

    if (this.config.displayAll){
      columns = Object.keys(metadataListRow)
        .filter(column => column.match('^(?!validationState).*'));
    } else { // display only fields inside the content object
      columns = Object.keys(metadataListRow)
        // .filter(column => column.match('^content.(?!core).*'));
        .filter(column => column.match('^content.*'));
    }

    if(this.config.displayState){
      columns.unshift('validationState');
    }

    return columns;
  }

  updateValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex)
    this.editing[rowIndex + '-' + cell] = false;
    this.metadataList[rowIndex][cell] = event.target.value;
    this.metadataList = [...this.metadataList];
    console.log('UPDATED!', this.metadataList[rowIndex][cell]);
    console.log(this.metadataList[rowIndex]);
  }

  //TODO create a service
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
        var isEmpty = true;
        for (var p in cur) {
          isEmpty = false;
          recurse(cur[p], prop ? prop + "." + p : p);
        }
        if (isEmpty && prop) result[prop] = {};
      }
    }
    recurse(data, "");
    return result;
  }

  unflatten(data) {
    "use strict";
    if (Object(data) !== data || Array.isArray(data)) return data;
    var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
      resultholder = {};
    for (var p in data) {
      var cur = resultholder,
        prop = "",
        m;
      while (m = regex.exec(p)) {
        cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
        prop = m[2] || m[1];
      }
      cur[prop] = data[p];
    }
    return resultholder[""] || resultholder;
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
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
}
