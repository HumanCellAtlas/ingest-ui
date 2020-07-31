import {Component} from '@angular/core';
import {LoaderService} from './shared/services/loader.service';
import 'rxjs-compat/add/operator/takeWhile';
import {AaiService} from './aai/aai.service';
import {Subject} from 'rxjs';
import {User} from 'oidc-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showLoader: boolean;
  loaderMessage: string;
  user$: Subject<User>;
  isSafari: boolean;

  constructor(private loaderService: LoaderService, private aai: AaiService) {
    this.isSafari = window['safari'] !== undefined;

    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });

    this.loaderService.message.subscribe((val: string) => {
      this.loaderMessage = val;
    });

    this.user$ = this.aai.getUserSubject();
  }

}
