import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {IngestService} from '../ingest.service';
import {Submission} from '../submission';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-submission',
  //templateUrl: './submission.component.html',
  template: `
    <ul *ngIf="submissions$ | async as submissions else noData">
      <li *ngFor="let submission of submissions">
        {{submission.submissionState}}
      </li>
    </ul>
    <ng-template #noData>No Data Available</ng-template>
  `,
  styleUrls: ['./submission.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SubmissionComponent implements OnInit {

  submissions$: Observable<Submission[]>;

  constructor(private ingestService: IngestService) { }

  ngOnInit() {
    this.submissions$ = this.ingestService.getAllSubmission();
  }

}
