import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AaiSecurity} from '../../aai/aai.module';
import {IngestService} from '../services/ingest.service';
import {Account} from '../../core/security.data';

@Injectable({
  providedIn: AaiSecurity,
})
export class UserIsWranglerGuard implements CanActivate {

  constructor(private ingestService: IngestService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.ingestService.getUserAccount()
      .map((acc: Account) => acc.roles.includes('WRANGLER') ? true : this.router.parseUrl('/home'));
  }
}
