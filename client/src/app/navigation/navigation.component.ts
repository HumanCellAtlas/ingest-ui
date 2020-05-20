import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IngestService} from '../shared/services/ingest.service';
import {AaiService} from '../aai/aai.service';
import {Observable, of} from 'rxjs';
import {concatMap} from 'rxjs/operators';
import {Account} from '../core/account';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationComponent implements OnInit {
  account$: Observable<Account>;
  isLoggedIn$: Observable<boolean>;


  constructor(private aai: AaiService, private ingestService: IngestService) {
    this.isLoggedIn$ = this.aai.isUserLoggedIn();
    this.account$ = this.isLoggedIn$.pipe(
      concatMap(loggedIn => {
        if (loggedIn) {
          return this.ingestService.getUserAccount();
        }
        return of(undefined);
      })
    );
  }

  ngOnInit() {

  }

}
