import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-metadata-state',
  templateUrl: './metadata-state.component.html',
  styleUrls: ['./metadata-state.component.css']
})
export class MetadataStateComponent implements OnInit {
  @Input()
  state: string;

  constructor() {
  }

  ngOnInit() {
  }

}
