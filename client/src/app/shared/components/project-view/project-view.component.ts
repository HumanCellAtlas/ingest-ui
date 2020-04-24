import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../../models/project';
import * as layout from '../../../submitter/project-form/layout.json';
import * as schema from '../../../submitter/project-form/flat-modified-schema.json';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {
  @Input() project: Project;
  projectLayout: any = (layout as any).default;
  projectSchema: any = (schema as any).default;
  options: object = {
    addSubmit: false,
    defautWidgetOptions: {
      readonly: true,
      addable: false,
      orderable: false,
      removable: false
    }
  };

  constructor(private alertService: AlertService) {
  }

  ngOnInit() {
    this.alertService.warn(null, 'This page is work in progress.', false, false);
    this.displayPostValidationErrors();
  }

  displayPostValidationErrors() {
    if (!this.project) {
      return null;
    }
    if (this.project.validationState !== 'Invalid') {
      return null;
    }
    const errorArray = [];
    for (const error of this.project.validationErrors) {
      if (error.userFriendlyMessage) {
        errorArray.push(error.userFriendlyMessage);
      } else {
        errorArray.push(error.message);
      }
    }
    this.alertService.error('JSON Validation Error', errorArray.join('<br>'));
    return errorArray.join('<br>');
  }


}
