import {Component, OnInit} from '@angular/core';
import {Profile} from 'oidc-client';
import {Router} from '@angular/router';
import {AaiService} from '../aai/aai.service';
import {concatMap, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Account} from '../core/account';
import {IngestService} from '../shared/services/ingest.service';

@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.css']
})
export class GlobalHeaderComponent implements OnInit {
  isLoggedIn: boolean;
  userInfo: Profile;
  account$: Observable<Account>;
  isLoggedIn$: Observable<boolean>;

  constructor(private router: Router, private ingestService: IngestService, private aai: AaiService) {
  }

  ngOnInit() {
    this.isLoggedIn$ = this.aai.isUserLoggedIn();
    this.account$ = this.aai.user$.pipe(
      map(user => {
        this.isLoggedIn = user && !user.expired;
        this.userInfo = user ? user.profile : null;
        return this.isLoggedIn;
      }),
      concatMap(loggedIn => {
        if (loggedIn) {
          return this.ingestService.getUserAccount();
        }
        return of(undefined);
      })
    );
  }

  logout(e) {
    e.preventDefault();
    this.aai.logout();
  }
}
