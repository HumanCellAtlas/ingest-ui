import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AaiService} from './aai.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {AaiSecurity} from "./aai.module";
import {concatMap} from "rxjs/operators";

@Injectable({
  providedIn: AaiSecurity,
})
export class OidcInterceptor implements HttpInterceptor {
  constructor(private aai: AaiService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
      const host = (new URL(request.url)).hostname
      if (environment.DOMAIN_WHITELIST.indexOf(host) > -1) {
        return this.aai.getAuthorizationHeaderValue().pipe(concatMap(authHeader => {
          const headerRequest = request.clone({
            setHeaders: {
              Authorization: authHeader
            }
          });
          return next.handle(headerRequest);
        }));
      } else {
        return next.handle(request);
      }
    } catch (e) {
      //TypeError @ new URL instantiation for non URL requests (e.g. file system access)
      return next.handle(request);
    }
  }
}
