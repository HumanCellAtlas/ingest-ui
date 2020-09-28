import {Component, OnInit, ViewChild} from '@angular/core';
import * as metadataSchema from '../../project-form/project-metadata-schema.json';
import * as ingestSchema from '../../project-form/project-ingest-schema.json';
import {Project} from '../../shared/models/project';
import {MetadataFormConfig} from '../../metadata-schema-form/models/metadata-form-config';
import {MatTabGroup} from '@angular/material/tabs';
import {ActivatedRoute, Router} from '@angular/router';
import {IngestService} from '../../shared/services/ingest.service';
import {AlertService} from '../../shared/services/alert.service';
import {LoaderService} from '../../shared/services/loader.service';
import {SchemaService} from '../../shared/services/schema.service';
import {projectRegLayout} from './project-reg-layout';
import {Observable} from 'rxjs';
import {concatMap} from 'rxjs/operators';

@Component({
  selector: 'app-project-registration-form',
  templateUrl: './project-registration-form.component.html',
  styleUrls: ['./project-registration-form.component.css']
})
export class ProjectRegistrationFormComponent implements OnInit {

  //  TODO This code needs a bit of refactoring.
  //  There are some code duplication here with Project form component.

  title: string;
  subtitle: string;

  projectMetadataSchema: any = (metadataSchema as any).default;
  projectIngestSchema: any = (ingestSchema as any).default;

  projectResource: Project;
  projectContent: object;

  projectFormData: object;
  formTabKey: string;

  config: MetadataFormConfig;

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

    this.config = {
      hideFields: [
        'describedBy',
        'schema_version',
        'schema_type',
        'provenance'
      ],
      layout: projectRegLayout,
      inputType: {
        'project_description': 'textarea',
        'notes': 'textarea'
      },
      overrideRequiredFields: {
        'project.content.contributors.project_role.text': false,
        'project.content.funders': false,
      },
      submitButtonLabel: 'Register Project',
      cancelButtonLabel: 'Or Cancel project registration'
    };

    this.formTabKey = this.config.layout.tabs[0].key;

    this.projectResource = null;
    this.projectContent = {};
    this.projectFormData = {
      content: {}
    };

    this.setSchema(this.projectFormData['content']);

    this.title = 'New Project';
    this.subtitle = 'Please provide initial information about your HCA project.\n' +
      '  You will be able to edit this information as your project develops.';

  }

  onSave(formData: object) {
    const formValue = formData['value'];
    const valid = formData['valid'];

    if (!this.incrementTab()) {
      if (valid) {
        this.saveProject(formValue);
      } else {
        {
          this.alertService.clear();
          const message = 'Some fields in the form are invalid. Please go back through the form to check the errors and resolve them.';
          this.alertService.error('Invalid Form', message);
        }
      }
    }
  }

  onCancel($event: boolean) {
    if ($event) {
      this.router.navigate(['/projects']);
    }
  }

  onTabChange($tabKey: string) {
    this.formTabKey = $tabKey;
  }

  incrementTab() {
    let index =  projectRegLayout.tabs.findIndex(tab => tab.key === this.formTabKey);
    if (index + 1 < projectRegLayout.tabs.length) {
      index++;
      this.formTabKey = projectRegLayout.tabs[index].key;
      return true;
    }
    return false;
  }

  decrementTab() {
    let index =  projectRegLayout.tabs.findIndex(tab => tab.key === this.formTabKey);
    if (index > 0) {
      index--;
      this.formTabKey = projectRegLayout.tabs[index].key;
      return true;
    }
    return false;
  }

  private setSchema(obj: object) {
    this.schemaService.getUrlOfLatestSchema('project').subscribe(schemaUrl => {
      obj['describedBy'] = schemaUrl;
      obj['schema_type'] = 'project';
      this.schema = schemaUrl;
    });
  }

  private saveProject(formValue) {
    this.loaderService.display(true);
    this.alertService.clear();
    this.createProject(formValue).subscribe(project => {
        console.log('Project saved', project);
        this.loaderService.display(false);
        this.router.navigate(['/projects']);
      },
      error => {
        this.loaderService.display(false);
        this.alertService.error('Error', error.message);
      });
  }

  private createProject(formValue: object): Observable<Project> {
    console.log('formValue', formValue);
    this.patch = formValue;
    return this.ingestService
      .postProject(this.patch)
      .pipe(concatMap(createdProject => this.ingestService.patchProject(createdProject, this.patch))); // save fields outside content
  }
}
