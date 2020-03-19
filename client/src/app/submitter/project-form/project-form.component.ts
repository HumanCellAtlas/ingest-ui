import {Component, OnInit} from '@angular/core';
import * as schema from './flat-modified-schema.json';
import * as layout from './layout.json';
import {ActivatedRoute, Router} from '@angular/router';
import {IngestService} from '../../shared/services/ingest.service';
import {AlertService} from '../../shared/services/alert.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  projectSchema: any = (schema as any).default;
  projectLayout: any = (layout as any).default;
  project: any;
  projectResource: any;
  createMode = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private ingestService: IngestService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    const projectUuid: string = this.route.snapshot.paramMap.get('uuid');
    this.project = {};

    if (projectUuid) {
      this.createMode = false;
      this.getProject(projectUuid);
    }

  }

  getProject(projectUuid) {
    this.ingestService.getProjectByUuid(projectUuid).subscribe(resource => {
      this.project = resource['content'];
      this.projectResource = resource;
    });
  }

  onSave($event) {
    this.alertService.clear();
    console.log('submit', $event);
    console.log('project', this.project);

    if (this.createMode) {
      console.log('creating project');
      this.ingestService.postProject(this.project).subscribe(resource => {
          console.log('project created', resource);
          const uuid = resource['uuid']['uuid'];
          this.router.navigate([`projects/${uuid}`]);
          this.alertService.success('Success', 'Project has been successfully created!', true);
        },
        error => {
          this.alertService.error('Error', error.message);
        });
    } else {
      this.ingestService.patchProject(this.projectResource, this.project).subscribe(resource => {
          this.alertService.success('Success', 'Project has been successfully updated!');
        },
        error => {
          this.alertService.error('Error', error.message);
        });
    }
  }

}
