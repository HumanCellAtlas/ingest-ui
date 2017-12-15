import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.css']
})
export class BundlesComponent implements OnInit {
  @Input() bundles;
  config = {
    displayContent: false,
    displayState: false,
    displayAll: true
  };

  constructor() { }

  ngOnInit() {
  }

}
