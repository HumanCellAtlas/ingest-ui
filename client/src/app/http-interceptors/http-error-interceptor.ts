import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router} from '@angular/router';

/** Handle http error response in one place. */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(retry(1), catchError(
      (error: HttpErrorResponse) => {

        if (this.router.url.startsWith('/error')) {
          // already on error page with some api call still throwing error
          return throwError(error);
        }
        // console.log(req.url)
        if (error.error instanceof ErrorEvent) {
          // client-side or network error
          console.error(error.error);
        } else {
          // server-side/backend service error
          console.error(error);

          // todo: catch any other 5xx server errors
          if (error.status === 0 || // unreachable server
            error.status === 500) { // internal server error
            const params = {
              queryParams: {
                reload: encodeURI(document.location.href)
              }
            };
            this.router.navigate(['/error'], params);
          }
        }

        // throw error as http error code may be needed in certain calls
        return throwError(error);
      }));
  }
}
