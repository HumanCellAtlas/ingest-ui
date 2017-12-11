import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {

  @Input() files$;

  constructor() { }

  ngOnInit() {
  }

}
