import {Component, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.css']
})
export class TextAreaComponent extends BaseInputComponent implements OnInit {
  rows: number;

  constructor() {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.rows = 3;
  }

}
