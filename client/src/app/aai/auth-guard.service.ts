import {Injectable} from '@angular/core';
import {AaiService} from './aai.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private aai: AaiService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.aai.isLoggedIn().pipe(
      map(isLoggedIn => {
        if (!isLoggedIn) {
          return this.router.parseUrl('/login');
        }
        return true;
      })
    );
  }
}
