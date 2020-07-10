import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AaiSecurity} from '../../aai/aai.module';
import {IngestService} from '../services/ingest.service';
import {Account} from '../../core/account';
import {AlertService} from "../services/alert.service";

@Injectable({
  providedIn: AaiSecurity,
})
export class UserIsWranglerGuard implements CanActivate {

  constructor(private ingestService: IngestService, private alertService: AlertService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.ingestService.getUserAccount()
      .map((account: Account) => account.isWrangler() || this.accessDenied(state.url) );
  }

  private accessDenied(url: string): UrlTree {
    this.alertService.error('Access Denied', `You cannot access the resource: ${url}`, true, true)
    return this.router.parseUrl('/home')
  }
}
