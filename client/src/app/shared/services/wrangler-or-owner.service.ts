import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AaiSecurity} from "../../aai/aai.module";
import {IngestService} from "./ingest.service";
import {Project} from "../models/project";
import {Account} from "../models/account";
@Injectable({
  providedIn: AaiSecurity,
})
export class WranglerOrOwner implements CanActivate {

  constructor(private ingestService: IngestService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    let accessChecks: Observable<boolean>;
    if (route.url.map(url => url.path).includes("projects") && (route.queryParams.hasOwnProperty('uuid') || route.queryParams.hasOwnProperty('id'))) {
      let getProject: Observable<any>;
      if (route.queryParams.hasOwnProperty('uuid')) {
        getProject = this.ingestService.getProjectByUuid(route.queryParams.uuid);
      } else if (route.queryParams.hasOwnProperty('id')) {
        getProject = this.ingestService.getProject(route.queryParams.id)
      }
      accessChecks = this.isWranglerOrOwner(this.ingestService.getUserAccount(), getProject);
    } else {
      accessChecks = this.isWrangler(this.ingestService.getUserAccount())
    }
    return accessChecks.map(access => access ? access : this.router.parseUrl('/home'));
  }

  isWranglerOrOwner(account: Observable<Account>, project: Observable<Project>): Observable<boolean> {
    let canAccess = new Array<Observable<boolean>>();
    canAccess.push(this.isWrangler(account));
    canAccess.push(this.isOwner(account, project));
    return Observable.forkJoin(canAccess).map(access => access.includes(true))
  }

  isWrangler(account: Observable<Account>): Observable<boolean> {
    return account.map(acc => acc.roles.includes('WRANGLER'));
  }

  isOwner(account: Observable<Account>, project: Observable<Project>): Observable<boolean> {
    let userIds = new Array<Observable<any>>();
    userIds.push(account.map((userAccount: Account) => userAccount.id));
    userIds.push(project.map((project: Project) => project.user).catch(() => Observable.of(false)));

    return Observable.forkJoin(userIds).map(input => input[0] == input[1]);
  }
}
