import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Project} from "../../shared/models/project";
import {IngestService} from "../../shared/ingest.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  projects$ : Observable<Project[]>;

  constructor(private ingestService: IngestService) { }

  ngOnInit() {
    this.projects$ = this.ingestService.getAllProjects();
  }

}
