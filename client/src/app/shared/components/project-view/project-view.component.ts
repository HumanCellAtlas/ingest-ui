import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../../models/project';

@Component({
  selector: 'project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {
  @Input() project: Project;

  constructor() { }

  ngOnInit(){
  }

}
