import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {IngestService} from "../shared/ingest.service";
import {ActivatedRoute, Router} from "@angular/router";

class Projects {
}

@Component({
  selector: 'app-new-submission-form',
  templateUrl: './new-submission-form.component.html',
  styleUrls: ['./new-submission-form.component.css']
})
export class NewSubmissionFormComponent implements OnInit {
  projects: Observable<Projects[]>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private ingestService: IngestService) {

  }

  ngOnInit() {
    this.projects = this.ingestService.getAllProjects();
  }

  saveAndExit() {
    console.log('save and exit.')
  }

  saveAndContinue() {
    console.log('save and continue.')
  }

  navigate(path) {
    this.router.navigate([path],
      {relativeTo: this.route});
  }

  fileChange(event) {
    console.log('file uploaded')
  }

}
