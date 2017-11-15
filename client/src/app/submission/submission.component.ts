import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IngestService} from '../ingest.service';
import {Submission} from '../submission';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SubmissionComponent implements OnInit {

  submissions$: Observable<Submission[]>;

  constructor(private ingestService: IngestService) {
  }

  ngOnInit() {
    this.submissions$ = this.ingestService.getAllSubmission();
  }
}


