import {Component, OnInit} from '@angular/core';
import * as schema from './flat-modified-schema.json';
import * as layout from './layout.json';
import {ActivatedRoute, Router} from '@angular/router';
import {IngestService} from '../../shared/services/ingest.service';
import {AlertService} from '../../shared/services/alert.service';
import {SchemaService} from '../../shared/services/schema.service';
import {Project} from '../../shared/models/project';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  projectSchema: any = (schema as any).default;
  projectLayout: any = (layout as any).default;
  projectResource: Project;
  createMode = true;
  formValidationErrors: any = null;
  formIsValid: boolean = null;
  formOptions: any = {
    addSubmit: true,
    defaultWidgetOptions: {feedback: true}
  };
  newProject: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private ingestService: IngestService,
              private alertService: AlertService,
              private schemaService: SchemaService) {
  }

  get prettyValidationErrors() {
    if (!this.formValidationErrors) {
      return null;
    }
    const errorArray = [];
    for (const error of this.formValidationErrors) {
      errorArray.push(error.message);
    }
    return errorArray.join('<br>');
  }

  get postValidationErrors() {
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
    return errorArray.join('<br>');
  }

  ngOnInit() {
    const projectUuid: string = this.route.snapshot.paramMap.get('uuid');
    this.newProject = {};

    if (projectUuid) {
      this.createMode = false;
      this.getProject(projectUuid);
    } else {
      this.schemaService.getLatestSchema('project').subscribe(latestProjectSchema => {
        this.newProject['describedBy'] = latestProjectSchema._links['json-schema'].href;
        this.newProject['schema_type'] = latestProjectSchema.domainEntity;
      });
    }

  }

  getProject(projectUuid) {
    this.ingestService.getProjectByUuid(projectUuid)
      .map(data => data as Project)
      .subscribe(resource => {
        console.log('project resource', this.projectResource);
        this.projectResource = resource;
        this.formIsValid = null;
        this.formValidationErrors = null;
      });
  }

  onSave() {
    this.alertService.clear();
    if (this.createMode) {
      console.log('Creating project');
      this.ingestService.postProject(this.newProject).subscribe(resource => {
          console.log('project created', resource);
          this.router.navigateByUrl(`/projects/detail?uuid=${resource['uuid']['uuid']}`);
          this.alertService.success('Success', 'Project has been successfully created!', true);
        },
        error => {
          this.alertService.error('Error', error.message);
        });
    } else {
      console.log('Updating project');

      this.ingestService.patchProject(this.projectResource, this.newProject).subscribe(resource => {
          console.log('project updated', resource);
          this.router.navigateByUrl(`/projects/detail?uuid=${resource['uuid']['uuid']}`);
          this.alertService.success('Success', 'Project has been successfully updated!', true);
        },
        error => {
          this.alertService.error('Error', error.message);
        });
    }
  }

  validationErrors(data: any) {
    this.formValidationErrors = data;
  }

  isValid(isValid: boolean) {
    this.formIsValid = isValid;
  }

  onChanges($event) {
    this.newProject = $event;
  }
}
