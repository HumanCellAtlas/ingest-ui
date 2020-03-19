import {Component, OnInit} from '@angular/core';
import * as schema from './flat-modified-schema.json';
import * as layout from './layout.json';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  projectSchema : any = (schema as any).default;
  projectLayout : any = (layout as any).default;

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit($event) {
    console.log('submit');
  }
}
