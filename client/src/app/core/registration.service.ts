import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {CoreSecurity} from './security.module';
import {Account} from './account';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: CoreSecurity,
})
export class RegistrationService {

  constructor(private http: HttpClient) {
  }

  private readonly BASE_URL = `${environment.INGEST_API_URL}/auth`;

  private static authoriseHeader(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  register(token: string): Promise<Account> {
    const url = `${this.BASE_URL}/registration`;
    return this.http
      .post<Account>(url, {}, {headers: RegistrationService.authoriseHeader(token)})
      .pipe(catchError((error: HttpErrorResponse) => {
        const serviceError = <RegistrationFailed>{};
        if ([403, 409].includes(error.status)) { // 403 Forbidden 409 Conflict
          serviceError.errorCode = RegistrationErrorCode.Duplication;
        } else {
          serviceError.errorCode = RegistrationErrorCode.ServiceError;
          serviceError.message = error.message;
        }
        throw serviceError;
      })).toPromise();
  }

}

export enum RegistrationErrorCode {
  Duplication = 'registration.error.duplicateAccounts',
  ServiceError = 'registration.error.serviceError',
  Unknown = 'registration.error.unknown'
}

export class RegistrationFailed implements Error {

  name = 'RegistrationFailed';
  message = 'Account registration failed';
  errorCode: RegistrationErrorCode = RegistrationErrorCode.Unknown;

}
