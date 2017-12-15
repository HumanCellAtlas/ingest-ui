import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {catchError, tap} from 'rxjs/operators';
import {UploadResults} from "./models/uploadResults";
import 'rxjs/add/observable/throw';

// Making use of https://stackoverflow.com/questions/35326689/how-to-catch-exception-correctly-from-http-request

@Injectable()
export class BrokerService {

  API_URL: string = 'http://ingest.integration.data.humancellatlas.org';

  constructor(private http: HttpClient) {
  }

  private handleError(operation: any) {
    return (err: any) => {
      let errMsg = `error in ${operation}()`;
      console.log(`${errMsg}:`, err.error)
      return Observable.throw(err.error);
    }
  }

  public uploadSpreadsheet(formData): Observable<UploadResults> {
    return this.http.post<UploadResults>(`${this.API_URL}/api_upload`, formData)
      .pipe(
        tap(data => console.log('server data:', data)),
        catchError(this.handleError('uploadSpreadsheet'))
      );
  }

}
