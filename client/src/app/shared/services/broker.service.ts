import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {UploadResults} from '../models/uploadResults';

import {environment} from '../../../environments/environment';
import {throwError} from 'rxjs/index';

// Making use of https://stackoverflow.com/questions/35326689/how-to-catch-exception-correctly-from-http-request

@Injectable()
export class BrokerService {

  API_URL: string = environment.BROKER_API_URL;

  constructor(private http: HttpClient) {
  }

  uploadSpreadsheet(formData, isUpdate = false): Observable<UploadResults> {
    const uploadApiSuffix = isUpdate ? '_update' : '';
    return this.http.post<UploadResults>(`${this.API_URL}/api_upload${uploadApiSuffix}`, formData)
      .pipe(
        tap(data => console.log('server data:', data)),
        catchError(this.handleError('uploadSpreadsheet'))
      );
  }

  downloadSpreadsheet(submissionUuid): Observable<any> {
    return this.http
      .get(`${this.API_URL}/submissions/${submissionUuid}/spreadsheet`,
        {observe: 'response', responseType: 'blob'}
      ).map((res) => {
        const contentDisposition = res.headers.get('content-disposition');
        const filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
        const response = {
          'data': res.body,
          'filename': filename
        };
        return response;
      });
  }

  generateTemplate(spec: object): Observable<any> {
    const url = `${this.API_URL}/spreadsheets`;
    return this.http.post(url, spec);
  }

  downloadTemplate(relativeUrl: string): Observable<HttpResponse<Blob>> {
    const url = `${this.API_URL}/${relativeUrl}`;
    return this.http.get(url, {responseType: 'blob', observe: 'response'});
  }

  private handleError(operation: any) {
    return (err: any) => {
      const errMsg = `error in ${operation}()`;
      console.log(`${errMsg}:`, err);

      const httpError = {
        message: 'An error occurred in uploading spreadsheet',
        details: `${err.name}: ${err.message}`
      };

      const error = err.error && err.error.message && err.error.details ? err.error : httpError;
      return throwError(error);
    };
  }
}
