import {Component, OnInit} from '@angular/core';
import * as schema from './flat-modified-schema.json';
import * as layout from './layout.json';
import {ActivatedRoute, Router} from '@angular/router';
import {IngestService} from '../../shared/services/ingest.service';
import {AlertService} from '../../shared/services/alert.service';
import {SchemaService} from '../../shared/services/schema.service';
import {Project} from '../../shared/models/project';
import * as project from './project.json';
import {MetadataFormConfig} from '../../shared/metadata-form/metadata-form-config';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  projectSchema: any = (schema as any).default;
  projectLayout: any = (layout as any).default;
  projectJsonSchema: any = (project as any).default;

  projectResource: Project;
  projectContent: object;
  projectNewContent: object;

  createMode = true;
  formValidationErrors: any = null;
  formIsValid: boolean = null;
  formOptions: any = {
    addSubmit: true,
    defaultWidgetOptions: {feedback: true}
  };
  config: MetadataFormConfig = {
    hideFields: ['describedBy', 'schema_version', 'schema_type'],
    removeEmptyFields: true,
    customFieldType: {
      'project.project_core.project_description': 'textarea'
    }
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private ingestService: IngestService,
              private alertService: AlertService,
              private schemaService: SchemaService) {
  }

  ngOnInit() {
    this.alertService.warn(null, 'This page is work in progress.', false, false);
    const projectUuid: string = this.route.snapshot.paramMap.get('uuid');
    this.projectResource = null;
    this.projectNewContent = null;
    this.formIsValid = null;
    this.formValidationErrors = null;
    this.projectContent = {};
    if (projectUuid) {
      this.createMode = false;
      this.setProjectContent(projectUuid);
    } else {
      this.setSchema(this.projectContent);
    }


  }

  setProjectContent(projectUuid) {
    this.ingestService.getProjectByUuid(projectUuid)
      .map(data => data as Project)
      .subscribe(projectResource => {
        console.log('load project resource', projectResource);
        this.projectResource = projectResource;
        if (!projectResource.content.hasOwnProperty('describedBy') || !projectResource.content.hasOwnProperty('schema_type')) {
          this.schemaService.getUrlOfLatestSchema('project').subscribe(schemaUrl => {
            projectResource.content['describedBy'] = schemaUrl;
            projectResource.content['schema_type'] = 'project';
            console.log('Patched Project content', projectResource.content);
          });
        }
        this.projectContent = projectResource.content;
        console.log('projectContent', this.projectContent);
        this.displayPostValidationErrors();
      });
  }

  displayPostValidationErrors() {
    if (!this.projectResource) {
      return null;
    }
    if (this.projectResource.validationState !== 'Invalid') {
      return null;
    }
    const errorArray = [];
    for (const error of this.projectResource.validationErrors) {
      errorArray.push(error.message);
    }
    this.alertService.error('JSON Validation Error', errorArray.join('<br>'));
    return errorArray.join('<br>');
  }

  setSchema(obj: object) {
    this.schemaService.getUrlOfLatestSchema('project').subscribe(schemaUrl => {
      obj['describedBy'] = schemaUrl;
      obj['schema_type'] = 'project';
    });
  }

  onSave(formValue: object) {
    this.alertService.clear();
    if (this.createMode) {
      console.log('Creating project', formValue);
      Object.assign(formValue, this.projectContent);
      this.ingestService.postProject(formValue).subscribe(resource => {
          console.log('project created', resource);
          this.router.navigateByUrl(`/projects/detail?uuid=${resource['uuid']['uuid']}`);
          this.alertService.success('Success', 'Project has been successfully created!', true);
        },
        error => {
          this.alertService.error('Error', error.message);
        });
    }
    //  else {
    //   console.log('Updating project', this.projectNewContent);
    //   this.ingestService.patchProject(this.projectResource, this.projectNewContent).subscribe(resource => {
    //       console.log('project updated', resource);
    //       this.router.navigateByUrl(`/projects/detail?uuid=${resource['uuid']['uuid']}`);
    //       this.alertService.success('Success', 'Project has been successfully updated!', true);
    //     },
    //     error => {
    //       this.alertService.error('Error', error.message);
    //     });
    // }
  }

  validationErrors(data: any) {
    this.formValidationErrors = data;
  }

  isValid(isValid: boolean) {
    this.formIsValid = isValid;
  }

  onChanges($event) {
    this.projectNewContent = $event;
  }

  onSubmit(formValue: object) {
    console.log('project json', formValue);
  }
}
