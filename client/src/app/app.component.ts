import {Component} from '@angular/core';
import {LoaderService} from './shared/services/loader.service';
import {Router} from '@angular/router';
import 'rxjs-compat/add/operator/takeWhile';
import {AaiService} from './aai/aai.service';
import {Profile} from 'oidc-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showLoader: boolean;
  isLoggedIn: boolean;
  userInfo: Profile;

  constructor(private router: Router,
              private aai: AaiService,
              private loaderService: LoaderService) {
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
    this.aai.isUserLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.aai.getUserSubject().subscribe(user => {
      this.isLoggedIn = user && !user.expired;
      if (user) {
        this.userInfo = user.profile;
      }
    });
  }

  logout() {
    this.aai.logout();
  }
}
