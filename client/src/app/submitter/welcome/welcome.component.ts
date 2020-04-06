import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IngestService} from '../../shared/services/ingest.service';
import {Observable} from 'rxjs';
import {Summary} from './summary';
import {AaiService} from '../../aai/aai.service';
import {Profile} from 'oidc-client';
import {Router} from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomeComponent implements OnInit {
  userInfo: Profile;
  summary$: Observable<Summary>;

  constructor(public aai: AaiService, private ingestService: IngestService, private router: Router) {
  }

  ngOnInit() {
    this.aai.getUserInfo().subscribe(profile => {
      this.userInfo = profile;
    });
    this.summary$ = this.ingestService.getUserSummary();
  }

  createProject() {
    this.router.navigate(['projects/new']);
  }
}
