import {Component, OnInit} from '@angular/core';
import {LoaderService} from './shared/services/loader.service';
import {AaiService} from './aai/aai.service';
import {IngestService} from './shared/services/ingest.service';
import {Observable} from 'rxjs';
import {Profile} from 'oidc-client';
import {Account} from './core/account';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showLoader: boolean;
  loaderMessage: string;
  isSafari: boolean;

  userProfile$: Observable<Profile>;
  userAccount$: Observable<Account>;

  constructor(private loaderService: LoaderService, private aai: AaiService, private ingestService: IngestService) {
    this.isSafari = window['safari'] !== undefined;

    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });

    this.loaderService.message.subscribe((val: string) => {
      this.loaderMessage = val;
    });
  }
  ngOnInit(): void {
    this.userProfile$ = this.aai.user$.filter(user => user && !user.expired).map(user => user.profile);
    this.userAccount$ = this.aai.user$.filter(user => user && !user.expired).concatMap(() => this.ingestService.getUserAccount());
  }

  onLogout($event: any) {
    this.aai.logout();
  }
}
