import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-metadata-list',
  templateUrl: './metadata-list.component.html',
  styleUrls: ['./metadata-list.component.css']
})
export class MetadataListComponent implements OnInit {
  @Input() metadataList;
  @Input() metadataType;

  constructor() { }

  ngOnInit() {
  }

}
