import {Injectable} from '@angular/core';
import {AaiService} from '../../aai/aai.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AaiSecurity} from '../../aai/aai.module';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: AaiSecurity,
})
export class UserIsLoggedInGuard implements CanActivate {

  constructor(private aai: AaiService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.aai.isUserLoggedIn().pipe(map(loggedIn => loggedIn ? loggedIn :
        this.router.parseUrl(`/login?redirect=${encodeURIComponent(state.url)}`)
    ));
  }
}
