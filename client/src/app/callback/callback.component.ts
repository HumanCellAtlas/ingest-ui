import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertService } from "../shared/services/alert.service";
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CallbackComponent implements OnInit {

  constructor(public auth: AuthService,
              public jwtHelper: JwtHelperService,
              private alertService: AlertService,
              public router: Router) {
    this.handleAuthentication()
  }

  public handleAuthentication(): void {
    let params = this.getJsonFromUrl();
    const accessToken = params['access_token'];
    let decodedToken = this.jwtHelper.decodeToken(accessToken);

    if(decodedToken['https://auth.data.humancellatlas.org/group'] != "hca"){
      this.alertService.clear();
      this.alertService.error("Unauthorized email", "Sorry, the email you used to login doesn't belong to HCA group. Please contact hca-ingest-dev@ebi.ac.uk for further information.", true, false)
      this.router.navigate(['/login']);
    }
    else{
      this.setSession(params);
      this.router.navigate(['/home']);
    }
  }

  private setSession(params): void {
    const accessToken = params['access_token'];
    const expiresIn = parseInt(params['expires_in'], 10)
    const idToken = params['id_token'];
    const expiresAt = JSON.stringify((expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('id_token', idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  private getJsonFromUrl() {
    let url = window.location.search;
    let query = url.substr(1);
    let result = {};
    query.split("&").forEach(function(part) {
      let item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }

  ngOnInit() {
  }

}
