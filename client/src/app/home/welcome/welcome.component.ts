import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IngestService} from '../../shared/services/ingest.service';
import {AuthService} from '../../auth/auth.service';
import {Observable} from "rxjs";
import {Summary} from "./summary";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomeComponent implements OnInit {
  profile: object;

  summary$: Observable<Summary>;

  constructor(public auth: AuthService, private ingestService: IngestService) {
  }

  ngOnInit() {
    this.auth.getProfile().subscribe((profile)=>{
      this.profile = profile
    });
    this.summary$ = this.ingestService.getUserSummary();
  }
}
