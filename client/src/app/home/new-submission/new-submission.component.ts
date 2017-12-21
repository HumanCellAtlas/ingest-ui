import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-new-submission',
  templateUrl: './new-submission.component.html',
  styleUrls: ['./new-submission.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NewSubmissionComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
  }

  redirect() {
    this.router.navigate(['submissions/new/metadata']);
  }

}
