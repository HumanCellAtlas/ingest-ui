import {Profile, User, UserManager} from 'oidc-client';
import {Injectable} from '@angular/core';
import {BehaviorSubject, from, Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AlertService} from '../shared/services/alert.service';
import {Router} from '@angular/router';
import {AuthenticationService} from "../core/authentication.service";
import {AaiSecurity} from "./aai.module";

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
    return this.manager.signinRedirectCallback().then((user: User) => {
      this.user = user;
      this.user$.next(user);
      this.authenticationService.getAccount(user.access_token)
        .then(() => {
          this.router.navigate(['/home']);
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
