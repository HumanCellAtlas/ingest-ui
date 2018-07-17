import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  @Input() projects = [];

  constructor() { }

  ngOnInit() {
  }

  getProjectId(project){
    let links = project['_links'];
    return links && links['self'] && links['self']['href'] ? links['self']['href'].split('/').pop() : '';
  }

  truncate(string, length){
    if(string && string.length > length){
      return string.substring(0, length) + '...'
    }
    return string;

  }

}
