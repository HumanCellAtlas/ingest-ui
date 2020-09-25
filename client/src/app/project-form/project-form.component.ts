import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IngestService} from '../shared/services/ingest.service';
import {AlertService} from '../shared/services/alert.service';
import {SchemaService} from '../shared/services/schema.service';
import {Project} from '../shared/models/project';
import * as metadataSchema from './project-metadata-schema.json';
import * as ingestSchema from './project-ingest-schema.json';
import {layout} from './layout';
import {LoaderService} from '../shared/services/loader.service';
import {Observable} from 'rxjs';
import {MatTabGroup} from '@angular/material/tabs';
import {MetadataFormConfig} from '../metadata-schema-form/models/metadata-form-config';
import {concatMap, map} from 'rxjs/operators';


@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  title: string;
  subtitle: string;

  projectMetadataSchema: any = (metadataSchema as any).default;
  projectIngestSchema: any = (ingestSchema as any).default;

  projectResource: Project;
  projectContent: object;

  projectFormData: object;

  createMode = true;
  formValidationErrors: any = null;
  formIsValid: boolean = null;
  formTabKey: string;

  config: MetadataFormConfig = {
    hideFields: [
      'describedBy',
      'schema_version',
      'schema_type',
      'provenance'
    ],
    layout: layout,
    inputType: {
      'project_description': 'textarea',
      'notes': 'textarea'
    },
    showCancelButton: true,
    showResetButton: false
  };

  patch: object = {};

  schema: string;

  @ViewChild('mf') formTabGroup: MatTabGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private ingestService: IngestService,
              private alertService: AlertService,
              private loaderService: LoaderService,
              private schemaService: SchemaService) {
  }

  ngOnInit() {
    this.projectIngestSchema['properties']['content'] = this.projectMetadataSchema;

    const projectUuid: string = this.route.snapshot.paramMap.get('uuid');
    if (this.route.snapshot.paramMap.has('tab')) {
      this.formTabKey = this.route.snapshot.paramMap.get('tab');
    } else {
      this.formTabKey = this.config.layout.tabs[0].key;
    }

    this.projectResource = null;
    this.formIsValid = null;
    this.formValidationErrors = null;
    this.projectContent = {};
    this.projectFormData = {
      content: {}
    };

    if (projectUuid) {
      this.createMode = false;
      this.setProjectContent(projectUuid);
    } else {
      this.setSchema(this.projectFormData['content']);
    }

    this.title = this.createMode ? 'New Project' : 'Edit Project';
    this.subtitle = this.createMode ? 'Please provide initial information about your HCA project.\n' +
      '  You will be able to edit this information as your project develops.' : '';
    this.config.showCancelButton = !this.createMode;
  }

  setProjectContent(projectUuid) {
    this.ingestService.getProjectByUuid(projectUuid)
      .pipe(map(data => data as Project))
      .subscribe(projectResource => {
        console.log('Retrieved project', projectResource);
        this.projectResource = projectResource;
        if (projectResource && projectResource.content &&
          !projectResource.content.hasOwnProperty('describedBy') || !projectResource.content.hasOwnProperty('schema_type')) {
          this.schemaService.getUrlOfLatestSchema('project')
            .subscribe(schemaUrl => {
              projectResource.content['describedBy'] = schemaUrl;
              projectResource.content['schema_type'] = 'project';
              this.schema = projectResource.content['describedBy'];
            });
        }

        this.schema = projectResource.content['describedBy'];

        this.projectContent = projectResource.content;
        this.projectFormData = this.projectResource;
        this.displayPostValidationErrors();
      },
      error => {
        this.alertService.error('Project could not be retrieved.', error.message);
      });
  }

  onTabChange($tabKey: string) {
    this.formTabKey = $tabKey;
  }

  onSave(formData: object) {
    const formValue = formData['value'];
    this.loaderService.display(true);
    this.alertService.clear();
    this.createOrSaveProject(formValue)
      .subscribe(project => {
          console.log('Project saved', project);
          this.updateProjectContent(project);
          this.loaderService.display(false);
          this.incrementTab();
        },
        error => {
          this.loaderService.display(false);
          this.alertService.error('Error', error.message);
        });
  }

  onBack($event: boolean) {
    this.decrementTab();
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
    this.schemaService.getUrlOfLatestSchema('project')
      .subscribe(schemaUrl => {
        obj['describedBy'] = schemaUrl;
        obj['schema_type'] = 'project';
        this.schema = schemaUrl;
      });
  }

  private updateProjectContent(projectResource: Project) {
    this.createMode = false;
    this.projectResource = projectResource;
    this.projectContent = this.projectResource.content;
  }

  private incrementTab() {
    let index =  layout.tabs.findIndex(tab => tab.key === this.formTabKey);
    index++;
    if (index >= layout.tabs.length) {
      this.router.navigateByUrl(`/projects/detail?uuid=${this.projectResource['uuid']['uuid']}`);
    } else {
      this.formTabKey = layout.tabs[index].key;
    }
  }

  private decrementTab() {
    const index = layout.tabs.findIndex(tab => tab.key === this.formTabKey);
    if (index > 0) {
      this.formTabKey = layout.tabs[index - 1].key;
    }
  }

  private createOrSaveProject(formValue: object): Observable<Project> {
    console.log('formValue', formValue);
    if (this.createMode) {
      this.patch = formValue;
      return this.ingestService.postProject(this.patch).pipe(
        concatMap(createdProject => this.ingestService.patchProject(createdProject, this.patch)), // save fields outside content
        map(project => project as Project)
      );
    } else {
      this.patch = formValue;
      return this.ingestService.patchProject(this.projectResource, this.patch).pipe(map(project => project as Project));
    }
  }
}
