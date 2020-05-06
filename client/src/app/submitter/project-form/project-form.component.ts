import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IngestService} from '../../shared/services/ingest.service';
import {AlertService} from '../../shared/services/alert.service';
import {SchemaService} from '../../shared/services/schema.service';
import {Project} from '../../shared/models/project';
import * as schema from './schema.json';
import * as layout from './layout.json';
import {MetadataFormConfig} from '../../shared/metadata-form/metadata-form-config';
import {LoaderService} from '../../shared/services/loader.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  title: string;
  subtitle: string;

  projectSchema: any = (schema as any).default;
  formLayout: any = (layout as any).default;

  projectResource: Project;
  projectContent: object;

  createMode = true;
  formValidationErrors: any = null;
  formIsValid: boolean = null;
  formTabIndex: number = 0;

  config: MetadataFormConfig = {
    hideFields: [
      'describedBy',
      'schema_version',
      'schema_type',
      'provenance'
    ],
    removeEmptyFields: true,

    layout: this.formLayout,
    inputType: {
      'project_description': 'textarea'
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
    if (this.route.snapshot.paramMap.has('tab')) {
      this.formTabIndex = +this.route.snapshot.paramMap.get('tab');
    }

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

  onSave(formValue: object) {
    this.loaderService.display(true);
    this.alertService.clear();
    this.createOrSaveProject(formValue).subscribe(project => {
        this.updateProjectContent(project);
        this.loaderService.display(false);
        this.incrementTab();
      },
      error => {
        this.loaderService.display(false);
        this.alertService.error('Error', error.message);
      });
  }

  onCancel($event: boolean) {
    if ($event) {
      if (this.createMode) {
        this.router.navigate(['/projects']);
      } else {
        this.router.navigateByUrl(`/projects/detail?uuid=${this.projectResource['uuid']['uuid']}`);
      }
    }

  }

  private updateProjectContent(projectResource: Project) {
    this.createMode = false;
    this.projectResource = projectResource;
    this.projectContent = this.projectResource.content;
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

  private incrementTab() {
    this.formTabIndex++;
    if (this.formLayout.hasOwnProperty('tabs') && this.formTabIndex >= this.formLayout['tabs'].length) {
      this.router.navigateByUrl(`/projects/detail?uuid=${this.projectResource['uuid']['uuid']}`);
    }
  }

  private createOrSaveProject(formValue: object): Observable<Project> {
    if (this.createMode) {
      console.log('Creating project', formValue);
      return this.ingestService.postProject(formValue).map(proj => proj as Project);
    } else {
      console.log('Updating project', formValue);
      return this.ingestService.patchProject(this.projectResource, formValue).map(proj => proj as Project);
    }
  }

  onTabChange($event: number) {
    this.formTabIndex = $event;
  }
}
