import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.css']
})

export class SamplesComponent implements OnInit {
  @Input() samples : Object[];

  constructor() {

  }
  ngOnInit() {

  }
}
