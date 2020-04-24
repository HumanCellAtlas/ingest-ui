import {Profile, User, UserManager, UserManagerSettings, WebStorageStateStore} from 'oidc-client';
import {Injectable} from '@angular/core';
import {BehaviorSubject, from, Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AlertService} from '../shared/services/alert.service';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

export function getClientSettings(): UserManagerSettings {
  return {
    authority: environment.AAI_AUTHORITY,
    client_id: environment.AAI_CLIENT_ID,
    redirect_uri: window.location.origin + '/aai-callback',
    post_logout_redirect_uri: window.location.origin,
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

  public user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private manager = new UserManager(getClientSettings());
  private user: User = null;

  constructor(private http: HttpClient,
              private alertService: AlertService,
              private router: Router) {

    this.user$.subscribe(usr => {
      this.user = usr;
    });
  }

  getUserSubject(): Subject<User> {
    return this.user$;
  }

  getUser(): Observable<User> {
    return from(this.manager.getUser()).map(user => {
      this.user$.next(user);
      return user;
    });
  }

  isUserLoggedIn(): Observable<boolean> {
    return this.getUser().map(user => user && !user.expired);
  }

  isUserFromEBI(): Observable<boolean> {
    return this.getUser().map(user => user && user.profile && user.profile.email.indexOf('@ebi.ac.uk') >= 0);
  }

  isUserLoggedInAndFromEBI(): Observable<boolean> {
    return Observable.forkJoin(this.isUserLoggedIn(), this.isUserFromEBI()).map(results => results[0] && results[1]);
  }

  getAuthorizationHeaderValue(): string {
    if (this.user) {
      return `${this.user.token_type} ${this.user.access_token}`;
    }
    throw new Error('No user was found!');
  }

  startAuthentication(): Promise<void> {
    return this.manager.signinRedirect();
  }

  completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then(user => {
      this.user = user;
      this.user$.next(user);
      this.router.navigate(['/home']);
    }).catch(error => {
      this.alertService.error('Authentication Error',
        'An error occured during authentication. Please retry logging in. ' +
        'If the error is persistent, please email hca-ingest-dev@ebi.ac.uk');
      console.error('Authentication callback error', error);
    });
  }

  getUserInfo(): Observable<Profile> {
    return this.getUser().map(user => {
      if (user) {
        return user.profile;
      }
    });
  }

  logout() {
    this.manager.signoutRedirect();
  }
}
