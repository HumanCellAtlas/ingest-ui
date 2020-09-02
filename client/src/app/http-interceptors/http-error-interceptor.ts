import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { Router, NavigationExtras } from "@angular/router";
import { AlertService } from '../shared/services/alert.service';

/** Handle http error response in one place. */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private alertService: AlertService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // skip auth urls
    //if (req.url.endsWith('/auth/account') ) {
    //  return next.handle(req);
    //}

    return next.handle(req).pipe(retry(1), catchError(
      (error: HttpErrorResponse) => {
        
        if (this.router.url.startsWith('/error')) {
          // already on error page with some api call still throwing error
          return throwError(error);
        }
        //console.log(req.url)
        if (error.error instanceof ErrorEvent) {
          // client-side or network error
          console.error(error.error.message)
        } else {
          // server-side/backend service error
          console.error(error.message)

          // todo: catch any other 5xx server errors
          if (error.status === 0 || // unreachable server
            error.status === 500) { // internal server error
            const params = {
              queryParams: {
                redirect: document.location.pathname
              }
            }
            this.router.navigate(["/error"], params);
          }
        }

        // throw error as http error code may be needed in certain calls
        return throwError(error);
      }));
  }
}
