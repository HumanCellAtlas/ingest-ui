import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IngestService} from '../shared/services/ingest.service';
import {AlertService} from '../shared/services/alert.service';
import {SchemaService} from '../shared/services/schema.service';
import {Project} from '../shared/models/project';
import * as metadataSchema from './project-metadata-schema.json';
import * as ingestSchema from './project-ingest-schema.json';
import {wranglerLayout} from './wrangler-layout';
import {LoaderService} from '../shared/services/loader.service';
import {Observable} from 'rxjs';
import {MatTabGroup} from '@angular/material/tabs';
import {MetadataFormConfig} from '../metadata-schema-form/models/metadata-form-config';
import {concatMap} from 'rxjs/operators';
import {MetadataFormLayout} from '../metadata-schema-form/models/metadata-form-layout';
import {contributorLayout} from './contributor-layout';

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
  formTabIndex = 0;

  formLayout: MetadataFormLayout;

  config: MetadataFormConfig;

  patch: object = {};

  schema: string;

  isWrangler: boolean;

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
      this.formTabIndex = +this.route.snapshot.paramMap.get('tab');
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


    this.ingestService.getUserAccount().subscribe(account => {
      this.isWrangler = account.isWrangler();

      // TODO Refactor checking of current role!!! Implement ability to toggle between account roles
      if (account.isWrangler() || !this.createMode) {
        this.formLayout = wranglerLayout;
      } else {
        this.formLayout = contributorLayout;
      }

      this.config = {
        hideFields: [
          'describedBy',
          'schema_version',
          'schema_type',
          'provenance'
        ],
        removeEmptyFields: true,
        layout: this.formLayout,
        inputType: {
          'project_description': 'textarea',
          'notes': 'textarea'
        },
        overrideRequiredFields: {
          'project.content.contributors.project_role.text': false,
          'project.content.funders': false
        }
      };

    });


  }

  setProjectContent(projectUuid) {
    this.ingestService.getProjectByUuid(projectUuid)
      .map(data => data as Project)
      .subscribe(projectResource => {
          console.log('Retrieved project', projectResource);
          this.projectResource = projectResource;
          if (projectResource && projectResource.content &&
            !projectResource.content.hasOwnProperty('describedBy') || !projectResource.content.hasOwnProperty('schema_type')) {
            this.schemaService.getUrlOfLatestSchema('project').subscribe(schemaUrl => {
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

  onSave(formData: object) {
    const formValue = formData['value'];
    const valid = formData['valid'];

    if (this.createMode && !this.isWrangler && this.formTabIndex+1 < this.formLayout.tabs.length) {
      console.log(`skipping save until last tab ${this.formTabIndex+1}/${this.formLayout.tabs.length}`);
      this.incrementTab();
    } else {
      console.log(`attempting save on last tab ${this.formTabIndex+1}/${this.formLayout.tabs.length}`);
      if (!this.isWrangler && !valid) {
        this.alertService.clear();
        this.alertService.error('Invalid Form', 'Please resolve the form validation errors first before proceeding.');
      }

      if ((!this.isWrangler && valid) || this.isWrangler) {
        this.loaderService.display(true);
        this.alertService.clear();
        this.createOrSaveProject(formValue).subscribe(project => {
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
    }
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

  onTabChange($event: number) {
    this.formTabIndex = $event;
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
      this.schema = schemaUrl;
    });
  }

  private updateProjectContent(projectResource: Project) {
    this.createMode = false;
    this.projectResource = projectResource;
    this.projectContent = this.projectResource.content;
  }

  private incrementTab() {
    this.formTabIndex++;
    if (this.formTabIndex >= this.formLayout.tabs.length) {
      if (this.isWrangler) {
        this.router.navigateByUrl(`/projects/detail?uuid=${this.projectResource['uuid']['uuid']}`);
      } else {
        this.router.navigate(['/projects']);
      }
    }
  }

  decrementTab() {
    if (this.formTabIndex > 0) {
      this.formTabIndex--;
    }
  }

  private createOrSaveProject(formValue: object): Observable<Project> {
    console.log('formValue', formValue);
    if (this.createMode) {
      this.patch = formValue;
      return this.ingestService.postProject(this.patch).pipe(concatMap(createdProject => {
        return this.ingestService.patchProject(createdProject, this.patch) // save fields outside content
          .map(project => project as Project);
      }));
    } else {
      this.patch = formValue;
      return this.ingestService.patchProject(this.projectResource, this.patch)
        .map(project => project as Project);
    }
  }
}
