import { Component, OnInit } from '@angular/core';
import {Project} from "../shared/models/project";
import {IngestService} from "../shared/ingest.service";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[];

  constructor(private ingestService: IngestService) { }

  ngOnInit() {
    this.ingestService.getProjects()
      .subscribe(data =>{
        this.projects = data;
      });
  }

}
