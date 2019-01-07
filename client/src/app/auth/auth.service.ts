import { Injectable } from '@angular/core';
import { AUTH_CONFIG } from './auth0-variables';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertService } from "../shared/services/alert.service";


@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: 'token id_token',
    audience: AUTH_CONFIG.apiUrl,
    redirectUri: AUTH_CONFIG.callbackURL,
    scope: 'openid profile read:profile email'
  });

  userProfile: any;

  constructor(public router: Router, public jwtHelper: JwtHelperService,  private alertService: AlertService) {}

  public login(): void {
    if(this.isAuthenticated()){
      alert('You are already logged in. Redirecting to homepage...')
      this.router.navigate(['/home']);
    } else {
      this.auth0.authorize();
    }
  }

  public handleAuthentication(): void {

    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        let decodedToken = this.jwtHelper.decodeToken(authResult.accessToken);

        if(decodedToken['https://auth.data.humancellatlas.org/group'] != "hca"){
          this.alertService.clear();
          this.alertService.error("Unauthorized email", "Sorry, the email you used to login doesn't belong to HCA group. Please contact hca-ingest-dev@ebi.ac.uk for further information.", true, false)
          this.router.navigate(['/login']);
        }
        else{
          window.location.hash = '';
          this.setSession(authResult);
          this.router.navigate(['/home']);
        }
      } else if (err) {
        this.router.navigate(['/login']);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      } else if(!this.isAuthenticated()) {
        this.router.navigate(['/login']);
      }
    });
  }

  public getProfile(cb): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    const self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/login']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }


}
