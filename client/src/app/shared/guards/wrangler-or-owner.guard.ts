import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AaiSecurity} from '../../aai/aai.module';
import {IngestService} from '../services/ingest.service';
import {Project} from '../models/project';
import {Account} from '../../core/account';

@Injectable({
  providedIn: AaiSecurity,
})
export class WranglerOrOwnerGuard implements CanActivate {

  constructor(private ingestService: IngestService, private router: Router) {
  }

  // TODO restriction to view project should be implemented in Ingest API
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    let accessChecks: Observable<boolean>;
    let getProject: Observable<any>;
    let params = {...route.queryParams, ...route.params};
    if (route.url.map(url => url.path).includes('projects') && params.hasOwnProperty('uuid')) {
      getProject = this.ingestService.getProjectByUuid(params.uuid);
    } else if (route.url.map(url => url.path).includes('projects') && params.hasOwnProperty('id')) {
      getProject = this.ingestService.getProject(params.id);
    } else if (route.url.map(url => url.path).includes('submissions') && (params.hasOwnProperty('project'))) {
      getProject = this.ingestService.getProjectByUuid(params.project);
    }
    if (getProject) {
      accessChecks = this.isWranglerOrOwner(this.ingestService.getUserAccount(), getProject).catch(() => Observable.of(false));
    } else {
      accessChecks = this.isWrangler(this.ingestService.getUserAccount()).catch(() => Observable.of(false));
    }
    return accessChecks.map(access => access ? access : this.router.parseUrl('/home'));
  }

  isWranglerOrOwner(account$: Observable<Account>, project$: Observable<Project>): Observable<boolean> {
    const canAccess = new Array<Observable<boolean>>();
    canAccess.push(this.isWrangler(account$));
    canAccess.push(this.isOwner(account$, project$));
    return Observable.forkJoin(canAccess).map(access => access.includes(true));
  }

  isWrangler(account: Observable<Account>): Observable<boolean> {
    return account.map(acc => acc.isWrangler());
  }

  isOwner(account: Observable<Account>, project: Observable<Project>): Observable<boolean> {
    const userIds = new Array<Observable<any>>();
    userIds.push(account.map((userAccount: Account) => userAccount.id));
    userIds.push(project.map((p: Project) => p.user));

    return Observable.forkJoin(userIds).map(input => input[0] === input[1]);
  }
}
