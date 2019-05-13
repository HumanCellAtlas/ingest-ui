import { Injectable } from '@angular/core';
import { AUTH_CONFIG } from './auth0-variables';
import * as auth0 from 'auth0-js';
import {Router} from "@angular/router";

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

  constructor(public router: Router) {}

  public login(): void {
    if(this.isAuthenticated()){
      alert('You are already logged in. Redirecting to homepage...')
      this.router.navigate(['/home']);
    } else {
      this.authorize()
    }
  }

  public authorize():void{
    window.location.href = `https://${AUTH_CONFIG.domain}/oauth/authorize?redirect_uri=${AUTH_CONFIG.callbackURL}`;
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
    });
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
