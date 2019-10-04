import { Injectable } from '@angular/core';
import { AUTH_CONFIG } from './auth0-variables';
import * as auth0 from 'auth0-js';
import {Router} from "@angular/router";
import {TimerObservable} from "rxjs-compat/observable/TimerObservable";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.auth0,
    responseType: 'token id_token',
    audience: AUTH_CONFIG.apiUrl,
    redirectUri: AUTH_CONFIG.callbackURL,
    scope: 'openid profile read:profile email'
  });

  userProfile: any;

  refreshTimer: TimerObservable<any>;
  refreshInterval: number = 5000; //5 sec

  alive : boolean = false;

  fusilladeConfig: any;

  constructor(public router: Router, private http: HttpClient) {
    this.refreshTimer = TimerObservable.create( 0, this.refreshInterval);
    this.refreshTimer.subscribe(() => {
        // this.refreshToken();
    });

    this.http.get(`https://${AUTH_CONFIG.domain}/.well-known/openid-configuration`).subscribe(
      res => {
        this.fusilladeConfig = res;
      });
  }

  public login(): void {
    if(this.isAuthenticated()){
      alert('You are already logged in. Redirecting to homepage...')
      this.router.navigate(['/home']);
    } else {
      this.authorize()
    }
  }

  public authorize():void{
    console.log('redirect', `https://${AUTH_CONFIG.domain}/oauth/authorize?redirect_uri=${AUTH_CONFIG.callbackURL}`);
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
      cb(err, profile);
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

  public refreshToken(): void {
    const tokenEndpoint = this.fusilladeConfig.get('token_endpoint');
    const refreshToken = localStorage.getItem('code');
    const params = {
      grant_type: 'refresh_token'
    }
    console.log('refresh token');
  }
}
