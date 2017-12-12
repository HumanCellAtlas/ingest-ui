import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-assays',
  templateUrl: './assays.component.html',
  styleUrls: ['./assays.component.css']
})
export class AssaysComponent implements OnInit {

  @Input() assays;

  constructor() { }

  ngOnInit() {
  }

}
