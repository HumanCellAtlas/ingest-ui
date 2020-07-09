import {Profile, User, UserManager} from 'oidc-client';
import {Injectable} from '@angular/core';
import {BehaviorSubject, from, Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AlertService} from '../shared/services/alert.service';
import {Router} from '@angular/router';
import {AuthenticationService} from '../core/authentication.service';
import {AaiSecurity} from './aai.module';

@Injectable({
  providedIn: AaiSecurity,
})
export class AaiService {

  public user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private user: User = null;

  constructor(private http: HttpClient,
              private manager: UserManager,
              private alertService: AlertService,
              private authenticationService: AuthenticationService,
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

  getAuthorizationHeaderValue(): Observable<string> {
    return this.getUser().map(user => `${user.token_type} ${user.access_token}`);
  }

  startAuthentication(redirect: string): Promise<void> {
    const state = {state:encodeURIComponent(redirect)}
    return this.manager.signinRedirect(state);
  }

  completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then((user: User) => {
      this.user = user;
      this.user$.next(user);
      this.authenticationService.getAccount(user.access_token)
        .then(() => {
          let redirect = user.state;
          if (redirect) {
            this.router.navigateByUrl(decodeURIComponent(redirect));
          } else {
            this.router.navigateByUrl('/home');
          }
        })
        .catch(() => {
          this.router.navigate(['/registration']);
        });
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
