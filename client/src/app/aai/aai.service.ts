import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, from} from 'rxjs';

import {User, UserManager} from 'oidc-client';
import {AlertService} from '../shared/services/alert.service';
import {IngestService} from '../shared/services/ingest.service';
import {AaiSecurity} from './aai.module';

@Injectable({
  providedIn: AaiSecurity,
})
export class AaiService {
  constructor(private http: HttpClient,
              private manager: UserManager,
              private alertService: AlertService,
              private ingestService: IngestService,
              private router: Router) {

  }
  private cachedUser$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  static authHeader(user: User): string {
    return user ? `${user.token_type} ${user.access_token}` : '';
  }

  static loggedIn(user: User): boolean {
    return user && !user.expired;
  }

  // Cannot pipe from BehaviorSubject, Only use .subscriptions or .value
  getUser(): BehaviorSubject<User> {
    // Cannot pipe from promises
    from(this.manager.getUser()).subscribe(user => this.setUser(user));
    return this.cachedUser$;
  }

  private setUser(user: User) {
    // Every call to .next will trigger subscribers, Only call when valid and different
    if (AaiService.loggedIn(user) && user.id_token !== this.cachedUser$.value?.id_token) {
      this.cachedUser$.next(user);
    }
  }

  userLoggedIn(): boolean {
    return AaiService.loggedIn(this.cachedUser$.value);
  }

  userAuthHeader(): string {
    return AaiService.authHeader(this.cachedUser$.value);
  }

  startAuthentication(redirect: string): Promise<void> {
    const state = {state: encodeURIComponent(redirect)};
    return this.manager.signinRedirect(state);
  }

  completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then((user: User) => {
      this.setUser(user);
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
        this.cachedUser$.next(null);
      }
    );
  }

  private checkForUserAccountRegistration(user: User) {
    this.ingestService.getUserAccount()
      .subscribe(() => {
        const redirect = user.state;
        if (redirect && redirect !== 'null') {
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
          }
        }
      });
  }
}
