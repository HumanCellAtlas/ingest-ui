import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {combineLatest, Observable, of} from 'rxjs';
import {AaiSecurity} from '../../aai/aai.module';
import {IngestService} from '../services/ingest.service';
import {Project} from '../models/project';
import {Account} from '../../core/account';
import {AlertService} from '../services/alert.service';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: AaiSecurity,
})
export class WranglerOrOwnerGuard implements CanActivate {

  constructor(private ingestService: IngestService, private alertService: AlertService, private router: Router) {
  }

  // TODO restriction to view project should be implemented in Ingest API
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    let getProject: Observable<Project>;
    const params = {...route.queryParams, ...route.params};
    if (route.url.map(url => url.path).includes('projects') && params.hasOwnProperty('uuid')) {
      getProject = this.ingestService.getProjectByUuid(params.uuid);
    } else if (route.url.map(url => url.path).includes('projects') && params.hasOwnProperty('id')) {
      getProject = this.ingestService.getProject(params.id);
    } else if (route.url.map(url => url.path).includes('submissions') && (params.hasOwnProperty('project'))) {
      getProject = this.ingestService.getProjectByUuid(params.project);
    }

    return ( getProject ?
      this.isWranglerOrOwner(this.ingestService.getUserAccount(), getProject) :
      this.isWrangler(this.ingestService.getUserAccount())
    ).pipe(
      map(access => access || this.accessDenied(state.url)),
      catchError(err => of(this.unexpectedError(state.url, err)))
    );
  }

  private accessDenied(url: string): UrlTree {
    this.alertService.error('Access Denied', `You cannot access the resource: ${url}`, true, true);
    return this.router.parseUrl('/home');
  }

  private unexpectedError(url: string, errorMessage: string): UrlTree {
    this.alertService.error('Error checking access', `You cannot access the resource: ${url} due to error ${errorMessage}`, true, true);
    return this.router.parseUrl('/home');
  }

  isWranglerOrOwner(account$: Observable<Account>, project$: Observable<Project>): Observable<boolean> {
    return combineLatest([
        this.isWrangler(account$),
        this.isOwner(account$, project$)
    ]).pipe(
      map(([isWrangler, isOwner]) => isWrangler || isOwner)
    );
  }

  isWrangler(account: Observable<Account>): Observable<boolean> {
    return account.pipe(map(acc => acc.isWrangler()));
  }

  isOwner(account: Observable<Account>, project: Observable<Project>): Observable<boolean> {
    return combineLatest([
      account.pipe(map(userAccount => userAccount.id)),
      project.pipe(map(proj => proj.user as string))
    ]).pipe(
      map(([userId, projectUserId]) => userId === projectUserId)
    );
  }
}
