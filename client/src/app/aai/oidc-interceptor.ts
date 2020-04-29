import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AaiService} from './aai.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {AaiSecurity} from "./aai.module";

@Injectable({
  providedIn: AaiSecurity,
})
export class OidcInterceptor implements HttpInterceptor {
  constructor(private aai: AaiService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const host = (new URL(request.url)).hostname
    if (environment.DOMAIN_WHITELIST.indexOf(host) > -1) {
      request = request.clone({
        setHeaders: {
          Authorization: this.aai.getAuthorizationHeaderValue()
        }
      });
      return next.handle(request);
    }
    return next.handle(request);
  }
}
