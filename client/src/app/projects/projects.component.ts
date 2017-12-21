import { Component, OnInit } from '@angular/core';
import {Project} from "../shared/models/project";
import {IngestService} from "../shared/ingest.service";
import {TimerObservable} from "rxjs/observable/TimerObservable";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[];

  interval: number;

  private alive: boolean;

  constructor(private ingestService: IngestService) {
    this.alive = true;
    this.interval = 4000;
  }

  ngOnInit() {
    this.getProjects();
  }

  ngOnDestroy(){
    this.alive = false; // switches your IntervalObservable off
  }

  pollProjects(){
    TimerObservable.create(0, this.interval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        this.getProjects();
      });

  }

  getProjects(){
    this.ingestService.getUserProjects()
      .subscribe(data =>{
        this.projects = data;
      });
  }
}
