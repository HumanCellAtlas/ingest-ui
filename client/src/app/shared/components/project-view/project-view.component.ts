import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../../models/project';
import * as layout from './view-layout.json';
import * as schema from '../../../submitter/project-form/flat-modified-schema.json';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {
  @Input() project: Project;
  projectLayout: any = (layout as any).default;
  projectSchema: any = (schema as any).default;
  options: object = {addSubmit: false};
  constructor() {
  }

  ngOnInit() {
  }

}
