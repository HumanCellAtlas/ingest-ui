import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../../models/project';
import {AlertService} from '../../services/alert.service';
import * as schema from '../../../submitter/project-form/schema.json';
import {MetadataFormConfig} from '../../metadata-form/metadata-form-config';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {
  @Input() project: Project;
  title: string;
  subtitle: string;

  projectJsonSchema: any = (schema as any).default;
  config: MetadataFormConfig = {
    hideFields: ['describedBy', 'schema_version', 'schema_type'],
    removeEmptyFields: true,
    customFieldType: {
      'project.project_core.project_description': 'textarea'
    },
    viewMode: true
  };

  constructor(private alertService: AlertService) {
  }

  ngOnInit() {
    this.alertService.warn(null, 'This page is work in progress.', false, true);
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
    const message = '<ul><li>' + errorArray.join('</li><li>') + '</li>';
    this.alertService.error('JSON Validation Error', message, false, false);
  }


}
