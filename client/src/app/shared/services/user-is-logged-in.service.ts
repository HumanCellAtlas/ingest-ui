import {Injectable} from '@angular/core';
import {AaiService} from '../../aai/aai.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AaiSecurity} from "../../aai/aai.module";

@Injectable({
  providedIn: AaiSecurity,
})
export class UserIsLoggedIn implements CanActivate {

  constructor(private aai: AaiService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.aai.isUserLoggedIn().map(loggedIn => loggedIn ? loggedIn : this.router.parseUrl('/login'));
  }
}
