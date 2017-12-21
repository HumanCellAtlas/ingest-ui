import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() currentPageInfo: Object;
  @Output() pageNumberChange: EventEmitter<number> = new EventEmitter<number>();

  maxPageDisplayed: number;

  constructor() {
    this.maxPageDisplayed = 15;
  }

  ngOnInit() {
  }

  goToPage(number){
    this.pageNumberChange.emit(number);
  }

  createRange(number){
    number = number > this.maxPageDisplayed ? this.maxPageDisplayed : number;

    let items: number[] = [];
    for(let i = 0; i < number; i++){
      items.push(i);
    }
    return items;
  }
}
