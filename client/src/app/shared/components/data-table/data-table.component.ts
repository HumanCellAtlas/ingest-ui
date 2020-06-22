import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Page} from '../../models/page';
import {FlattenService} from '../../services/flatten.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  @ViewChild('datatable') table: any;
  @Input() rows: object[];
  @Input() columns: string[];
  @Input() idColumn: string;
  @Input() flatten = false;
  page: Page = {number: 0, size: 0, sort: '', totalElements: 0, totalPages: 0};
  isPaginated: boolean;
  currentPageInfo: {};
  private alive: boolean;
  private isLoading = false;


  constructor(private flattenService: FlattenService) {
    this.page.number = 0;
    this.page.size = 20;
  }

  ngOnInit() {
    this.setPage({offset: 0});
    this.rows = this.flatten ? this.rows : this.rows.map(this.flattenService.flatten);
    this.columns = this.columns ? this.columns : this.getAllColumns(this.rows);
  }

  getAllColumns(rows) {
    const columns = {};
    rows.map(function (row) {
      Object.keys(row).map(function (col) {
        columns[col] = '';
      });
    });

    const filteredColumns = Object.keys(columns)
    filteredColumns.filter(column => {
      return (!column.match('[\[]')); // exclude attributes which are of list type
    });

    return filteredColumns;
  }

  setPage(pageInfo) {
    this.currentPageInfo = pageInfo;
    this.page.number = pageInfo.offset;
    this.alive = true;
  }

  getRowId(row) {
    const id = this.idColumn ? this.idColumn : 'id';
    return row[id];
  }

  isUrl(value: string) {
    try {
      const url = new URL(value);
    } catch (_) {
      return false;
    }

    return true;
  }
}
