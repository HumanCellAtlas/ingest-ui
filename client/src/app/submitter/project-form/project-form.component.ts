import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IngestService} from '../../shared/services/ingest.service';
import {AlertService} from '../../shared/services/alert.service';
import {SchemaService} from '../../shared/services/schema.service';
import {Project} from '../../shared/models/project';
import * as schema from './schema.json';
import {MetadataFormConfig} from '../../shared/metadata-form/metadata-form-config';
import {LoaderService} from '../../shared/services/loader.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  title: string;
  subtitle: string;

  projectJsonSchema: any = (schema as any).default;

  projectResource: Project;
  projectContent: object;

  createMode = true;
  formValidationErrors: any = null;
  formIsValid: boolean = null;

  config: MetadataFormConfig = {
    hideFields: [
      'describedBy',
      'schema_version',
      'schema_type',
      'provenance'
    ],
    removeEmptyFields: true,

    layout: {
      'tabs': [
        {
          'title': 'Project',
          'items': [
            'project.project_core',
            'project.array_express_accessions',
            'project.biostudies_accessions',
            'project.geo_series_accessions',
            'project.insdc_project_accessions',
            'project.insdc_study_accessions',
            'project.supplementary_links'
          ]
        },
        {
          'title': 'Contributors',
          'items': [
            'project.contributors'
          ]
        },
        {
          'title': 'Publications',
          'items': [
            'project.publications'
          ]
        },
        {
          'title': 'Funders',
          'items': [
            'project.funders'
          ]
        }
      ]
    }
  };


  constructor(private route: ActivatedRoute,
              private router: Router,
              private ingestService: IngestService,
              private alertService: AlertService,
              private loaderService: LoaderService,
              private schemaService: SchemaService) {
  }

  ngOnInit() {
    const projectUuid: string = this.route.snapshot.paramMap.get('uuid');
    this.projectResource = null;
    this.formIsValid = null;
    this.formValidationErrors = null;
    this.projectContent = {};

    if (projectUuid) {
      this.createMode = false;
      this.setProjectContent(projectUuid);
    } else {
      this.setSchema(this.projectContent);
    }

    this.title = this.createMode ? 'New Project' : 'Edit Project';
    this.subtitle = this.createMode ? 'Please provide initial information about your HCA project.\n' +
      '  You will be able to edit this information as your project develops.' : '';
  }

  setProjectContent(projectUuid) {
    this.ingestService.getProjectByUuid(projectUuid)
      .map(data => data as Project)
      .subscribe(projectResource => {
          console.log('get project', projectResource);
          this.projectResource = projectResource;
          if (projectResource && projectResource.content &&
            !projectResource.content.hasOwnProperty('describedBy') || !projectResource.content.hasOwnProperty('schema_type')) {
            this.schemaService.getUrlOfLatestSchema('project').subscribe(schemaUrl => {
              projectResource.content['describedBy'] = schemaUrl;
              projectResource.content['schema_type'] = 'project';
            });
          }
          this.projectContent = projectResource.content;
          this.displayPostValidationErrors();
        },
        error => {
          this.alertService.error('Project could not be retrieved.', error.message);
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
      errorArray.push(error.userFriendlyMessage);
    }
    const message = '<ul><li>' + errorArray.join('</li><li>') + '</li>';
    this.alertService.error('JSON Validation Error', message, false, false);
  }

  setSchema(obj: object) {
    this.schemaService.getUrlOfLatestSchema('project').subscribe(schemaUrl => {
      obj['describedBy'] = schemaUrl;
      obj['schema_type'] = 'project';
    });
  }

  onSave(formValue: object) {
    this.loaderService.display(true);
    this.alertService.clear();
    if (this.createMode) {
      console.log('Creating project', formValue);
      Object.assign(formValue, this.projectContent);
      this.ingestService.postProject(formValue).subscribe(resource => {
          this.loaderService.display(false);
          console.log('project created', resource);
          this.router.navigateByUrl(`/projects/detail?uuid=${resource['uuid']['uuid']}`);
          this.alertService.success('Success', 'Project has been successfully created!', true);
        },
        error => {
          this.loaderService.display(false);
          this.alertService.error('Error', error.message);
        });
    } else {
      console.log('Updating project', formValue);
      this.ingestService.patchProject(this.projectResource, formValue).subscribe(resource => {
          this.loaderService.display(false);
          console.log('project updated', resource);
          this.router.navigateByUrl(`/projects/detail?uuid=${resource['uuid']['uuid']}`);
          this.alertService.success('Success', 'Project has been successfully updated!', true);
        },
        error => {
          this.loaderService.display(false);
          this.alertService.error('Error', error.message);
        });
    }
  }

  onCancel($event: boolean) {
    if ($event) {
      this.router.navigate(['/projects']);
    }

  }
}
