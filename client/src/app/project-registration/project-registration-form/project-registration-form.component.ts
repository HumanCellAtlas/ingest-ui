import {Component, OnInit, ViewChild} from '@angular/core';
import * as metadataSchema from '../../submitter/project-form/project-metadata-schema.json';
import * as ingestSchema from '../../submitter/project-form/project-ingest-schema.json';
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

  title: string;
  subtitle: string;

  projectMetadataSchema: any = (metadataSchema as any).default;
  projectIngestSchema: any = (ingestSchema as any).default;

  projectResource: Project;
  projectContent: object;

  projectFormData: object;
  formTabIndex = 0;

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
      removeEmptyFields: true,
      layout: projectRegLayout,
      inputType: {
        'project_description': 'textarea',
        'notes': 'textarea'
      },
      overrideRequiredFields: {
        'project.content.contributors.project_role.text': false,
        'project.content.funders': false,
      },
      submitButtonLabel: 'Register Project'
    };

    if (this.route.snapshot.paramMap.has('tab')) {
      this.formTabIndex = +this.route.snapshot.paramMap.get('tab');
    }

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

    if (this.formTabIndex + 1 < projectRegLayout.tabs.length) {
      this.incrementTab();
    } else {
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

  onTabChange($event: number) {
    this.formTabIndex = $event;
  }

  decrementTab() {
    if (this.formTabIndex > 0) {
      this.formTabIndex--;
    }
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

  private incrementTab() {
    this.formTabIndex++;
  }

  private createProject(formValue: object): Observable<Project> {
    console.log('formValue', formValue);
    this.patch = formValue;
    return this.ingestService.postProject(this.patch).pipe(concatMap(createdProject => {
      return this.ingestService.patchProject(createdProject, this.patch) // save fields outside content
        .map(project => project as Project);
    }));

  }

}
