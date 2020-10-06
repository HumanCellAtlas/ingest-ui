import {Injectable} from '@angular/core';
import {AaiService} from '../../aai/aai.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AaiSecurity} from '../../aai/aai.module';

@Injectable({
  providedIn: AaiSecurity,
})
export class UserIsLoggedInGuard implements CanActivate {

  constructor(private aai: AaiService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.aai.userLoggedIn() ? true : this.router.parseUrl(`/login?redirect=${encodeURIComponent(state.url)}`);
  }
}
