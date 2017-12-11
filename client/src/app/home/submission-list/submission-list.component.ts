import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IngestService} from '../../shared/ingest.service';
import {Observable} from "rxjs/Observable";
import {SubmissionEnvelope} from "../../shared/models/submissionEnvelope";
import {ListResult} from "../../shared/models/hateoas";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SubmissionListComponent implements OnInit {

  submissionEnvelopes$: Observable<SubmissionEnvelope[]>;

  submissionEnvelopeList$: Observable<ListResult<SubmissionEnvelope>>;

  constructor(private ingestService: IngestService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.submissionEnvelopes$ = this.ingestService.pollSubmissions();
    // this.submissionEnvelopeList$ = this.ingestService.pollSubmissionsHAL();
  }

  getSubmitLink(submissionEnvelope){
    let links = submissionEnvelope['_links'];
    return links ? links['submit'] : null;
  }s

  completeSubmission(submissionEnvelope) {
    let submitLink = this.getSubmitLink(submissionEnvelope);
    this.ingestService.submit(submitLink);
    console.log('completeSubmission');
  }

  viewSubmission(submissionEnvelope){
    console.log('view submission');
  }

  redirect() {
    this.router.navigate(['submission']);
  }
}


