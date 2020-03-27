import {Component, OnInit} from '@angular/core';
import * as schema from './flat-modified-schema.json';
import * as layout from './layout.json';
import {ActivatedRoute, Router} from '@angular/router';
import {IngestService} from '../../shared/services/ingest.service';
import {AlertService} from '../../shared/services/alert.service';
import {SchemaService} from '../../shared/services/schema.service';
import {concatMap} from 'rxjs/operators';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  projectSchema: any = (schema as any).default;
  projectLayout: any = (layout as any).default;
  project: object;
  projectResource: any;
  createMode = true;
  formValidationErrors :any = null;
  formIsValid: boolean = null;
  formOptions: any = {
    addSubmit: true,
    defaultWidgetOptions: { feedback: true }
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private ingestService: IngestService,
              private alertService: AlertService,
              private schemaService: SchemaService) {
  }

  ngOnInit() {
    const projectUuid: string = this.route.snapshot.paramMap.get('uuid');
    this.project = {};

    if (projectUuid) {
      this.createMode = false;
      this.getProject(projectUuid);
    } else {
      this.schemaService.getLatestSchema('project').subscribe(latestProjectSchema => {
        this.project['describedBy'] = latestProjectSchema._links['json-schema'].href;
        this.project['schema_type'] = latestProjectSchema.domainEntity;
        console.log('Default Project Data', this.project)
      })
    }

  }

  getProject(projectUuid) {
    this.ingestService.getProjectByUuid(projectUuid).subscribe(resource => {
      this.project = resource['content'];
      this.projectResource = resource;
      this.formIsValid = null;
      this.formValidationErrors = null;
    });
  }

  onSave() {
    this.alertService.clear();
    console.log('project', this.project);
    if (this.createMode) {
      console.log('Creating project');
      this.ingestService.postProject(this.project).subscribe(resource => {
          console.log('project created', resource);
          this.router.navigateByUrl(`/projects/detail?uuid=${resource['uuid']['uuid']}`);
          this.alertService.success('Success', 'Project has been successfully created!', true);
        },
        error => {
          this.alertService.error('Error', error.message);
        });
    } else {
      console.log('Updating project');
      this.ingestService.patchProject(this.projectResource, this.project).subscribe(resource => {
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

  get prettyValidationErrors() {
    if (!this.formValidationErrors) { return null; }
    const errorArray = [];
    for (const error of this.formValidationErrors) {
      errorArray.push(error.message);
    }
    return errorArray.join('<br>');
  }
}
