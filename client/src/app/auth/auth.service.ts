import {Injectable} from '@angular/core';
import {AUTH_CONFIG} from './auth0-variables';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of, Subscription} from "rxjs";
import {AuthConfig, OpenIdConfig, UserInfo} from "./auth.model";
import {mergeMap} from "rxjs/operators";
import {TimerObservable} from "rxjs-compat/observable/TimerObservable";


@Injectable()
export class AuthService {

  config: AuthConfig;
  openIdConfig: OpenIdConfig;
  silentAuthInterval: number;
  private silentAuthTimer: Observable<number>;
  private readonly tokenDuration: number
  private readonly tokenRefreshPeriod: number;
  private silentAuthSubscription: Subscription;
  private userInfo$: Observable<UserInfo>;

  constructor(private router: Router, private http: HttpClient) {
    this.config = AUTH_CONFIG;
    this.tokenDuration = 900000; // 15 min
    this.tokenRefreshPeriod = 60000; // 1min
    this.silentAuthInterval = this.tokenDuration - this.tokenRefreshPeriod;
  }

  getOpenIdConfig(): Observable<OpenIdConfig> {
    if (this.openIdConfig) {
      return of(this.openIdConfig);
    } else {
      return this.http.get(`https://${this.config.domain}/.well-known/openid-configuration`)
        .map((response) => response as OpenIdConfig);
    }
  }

  getUserInfo(): Observable<UserInfo> {
    if (this.userInfo$){
      return this.userInfo$;
    }
    return this.getOpenIdConfig().pipe(mergeMap((openIdConfig) => {
      const userInfoEndpoint = openIdConfig.userinfo_endpoint;
      const accessToken = this.getAccessToken();

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        })
      };

      this.userInfo$ = this.http.get(userInfoEndpoint, httpOptions)
        .map((response) => response as UserInfo);

      return this.userInfo$;
    }))
  }


  authorize(): void {
    this.getOpenIdConfig().subscribe((openIdConfig) => {
      const authorizeEndpoint = openIdConfig.authorization_endpoint;
      const params = {
        redirect_uri: this.config.callbackUrl,
      };

      const urlParams: string = this.buildSearchParams(params);
      const url: string = `${authorizeEndpoint}?${urlParams}`;
      this.redirect(url);
    })
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  authorizeSilently(): void {
    this.getOpenIdConfig().subscribe((openIdConfig) => {
      const authorizeEndpoint = openIdConfig.authorization_endpoint
      const params = {
        scope: 'openid profile read:profile email',
        redirect_uri: this.config.callbackUrl,
        prompt: 'none'
      };

      const urlParams: string = this.buildSearchParams(params);
      const url: string = `${authorizeEndpoint}?${urlParams}`;

      this.runIframe(url, `https://${this.config.domain}`).then((data) => {
        console.debug('code result', data);
        this.setSession(data);
      })
    })
  }

  setUpSilentAuth(): void {
    this.silentAuthTimer = TimerObservable.create(this.silentAuthInterval, this.silentAuthInterval)
      .takeWhile(() => this.isAuthenticated());

    this.silentAuthSubscription = this.silentAuthTimer.subscribe(() => {
      this.authorizeSilently();
    });
  }

  logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');

    this.getOpenIdConfig().pipe(mergeMap((openIdConfig) => {
      const logoutEndpoint = openIdConfig.logout_endpoint;
      return this.http.get(logoutEndpoint);
    })).subscribe(
      ()=> {
      console.log('successfully logged out...');
    }, err => {
      console.error('Error in logging out', err)
    });

    this.router.navigate(['/login']);
  }

  setSession(params): void {
    const accessToken = params['access_token'];
    const expiresIn = parseInt(params['expires_in'], 10)
    const idToken = params['id_token'];
    const expiresAt = JSON.stringify((expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('id_token', idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  getAccessToken(): string {
    return localStorage.getItem('access_token');
  }

  redirect(url): void {
    window.location.href = url;
  }

  runIframe(authorizeUrl: string, eventOrigin: string) {
    return new Promise<object>((res, rej) => {
      var iframe = window.document.createElement('iframe');
      iframe.setAttribute('width', '0');
      iframe.setAttribute('height', '0');
      iframe.style.display = 'none';

      const timeoutSetTimeoutId = setTimeout(() => {
        rej('timed out');
        window.document.body.removeChild(iframe);
      }, 60 * 1000);

      const iframeEventHandler = function (e: MessageEvent) {
        if (e.origin != eventOrigin) return;
        if (!e.data || e.data.type !== 'authorization_response') return;
        (<any>e.source).close();
        e.data.response.error ? rej(e.data.response) : res(e.data.response);
        clearTimeout(timeoutSetTimeoutId);
        window.removeEventListener('message', iframeEventHandler, false);
        window.document.body.removeChild(iframe);
      };
      window.addEventListener('message', iframeEventHandler, false);
      window.document.body.appendChild(iframe);
      iframe.setAttribute('src', authorizeUrl);
    });
  };

  buildSearchParams(obj): string {
    const params = new URLSearchParams();
    for (let key in obj) {
      params.set(key, obj[key])
    }
    return params.toString();
  }
}
