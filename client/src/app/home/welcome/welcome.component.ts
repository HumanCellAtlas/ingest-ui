import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IngestService} from '../../shared/services/ingest.service';
import {Observable} from 'rxjs';
import {Summary} from './summary';
import {AaiService} from '../../aai/aai.service';
import {Profile} from 'oidc-client';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomeComponent implements OnInit {
  userInfo: Profile;
  summary$: Observable<Summary>;

  constructor(public aai: AaiService, private ingestService: IngestService) {
  }

  ngOnInit() {
    this.userInfo = this.aai.getUserInfo();
    this.summary$ = this.ingestService.getUserSummary();
  }
}
