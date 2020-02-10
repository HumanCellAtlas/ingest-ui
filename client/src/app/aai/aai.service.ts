import {Profile, User, UserManager, UserManagerSettings, WebStorageStateStore} from 'oidc-client';
import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AlertService} from '../shared/services/alert.service';
import {Router} from '@angular/router';

export function getClientSettings(): UserManagerSettings {
  return {
    authority: 'https://login.elixir-czech.org/oidc',
    client_id: '',
    redirect_uri: 'http://localhost:4200/aai-callback',
    post_logout_redirect_uri: 'http://localhost:4200/',
    response_type: 'token id_token',
    scope: 'email openid profile',
    filterProtocolClaims: true,
    loadUserInfo: true,
    userStore: new WebStorageStateStore({store: window.localStorage})
  };
}

@Injectable({
  providedIn: 'root'
})
export class AaiService {

  private manager = new UserManager(getClientSettings());
  private user: User = null;

  constructor(private http: HttpClient,
              private alertService: AlertService,
              private router: Router) {

    this.getUser().then(user => {
      this.user = user;
    });
  }

  getUser(): Promise<User> {
    return this.manager.getUser();
  }

  isLoggedIn(): Observable<boolean> {
    return from(this.manager.getUser()).map(user => user && !this.user.expired);
  }

  isAuthenticated(): boolean {
    return this.user && !this.user.expired;
  }

  isUserFromEBI(): boolean {
    return this.user && this.user.profile && this.user.profile.email.indexOf('ebi') >= 0;
  }

  getAuthorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  startAuthentication(): Promise<void> {
    return this.manager.signinRedirect();
  }

  completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then(user => {
      this.user = user;
      this.router.navigate(['/home']);
    }).catch(function (err) {
      console.log('err', err);
    });
  }

  getUserInfo(): Profile {
    if (this.user) {
      return this.user.profile;
    }
  }

  logout() {
    this.manager.signoutRedirect();
  }
}
