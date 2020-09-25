import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, from} from 'rxjs';
import {map} from 'rxjs/operators';

import {User, UserManager} from 'oidc-client';
import {AlertService} from '../shared/services/alert.service';
import {IngestService} from '../shared/services/ingest.service';
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
              private ingestService: IngestService,
              private router: Router) {

    this.user$.subscribe(usr => {
      this.user = usr;
    });
  }

  getUserSubject(): Subject<User> {
    return this.user$;
  }

  getUser(): Observable<User> {
    return from(this.manager.getUser()).pipe(map(user => {
      this.user$.next(user);
      return user;
    }));
  }

  isUserLoggedIn(): Observable<boolean> {
    return this.getUser().pipe(map(user => user && !user.expired));
  }

  getAuthorizationHeaderValue(): Observable<string> {
    return this.getUser().pipe(map(user => user ? `${user.token_type} ${user.access_token}` : ''));
  }

  startAuthentication(redirect: string): Promise<void> {
    const state = {state: encodeURIComponent(redirect)};
    return this.manager.signinRedirect(state);
  }

  completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then((user: User) => {
      this.user = user;
      this.user$.next(user);
      this.checkForUserAccountRegistration(user);
    }).catch(error => {
      this.alertService.error('Authentication Error',
        'An error occured during authentication. Please retry logging in. ' +
        'If the error is persistent, please email hca-ingest-dev@ebi.ac.uk');
      console.error('Authentication callback error', error);
    });
  }

  logout() {
    this.manager.signoutRedirect();
  }

  private removeUser() {
    this.manager.removeUser().then(
      () => {
        console.log('removing user');
        this.user$.next(null);
      }
    );
  }

  private checkForUserAccountRegistration(user: User) {
    this.ingestService.getUserAccount()
      .subscribe(() => {
        const redirect = user.state;
        if (redirect) {
          this.router.navigateByUrl(decodeURIComponent(redirect));
        } else {
          this.router.navigateByUrl('/home');
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 404) {
            this.router.navigate(['/registration']);
          } else {
            this.alertService.error('Ingest Service Error',
              'A problem occurred while trying to check the user account from the Ingest Service.' +
              ' Please try again later. If the error is persistent, please email hca-ingest-dev@ebi.ac.uk');
            this.removeUser();
          }
        }
      });
  }
}
