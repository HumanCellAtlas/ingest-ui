import {Observable} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {CoreSecurity} from './security.module';
import {Account} from './account';

@Injectable({
  providedIn: CoreSecurity,
})
export class RegistrationService {

  private readonly BASE_URL = `${environment.INGEST_API_URL}/auth`;

  constructor(private http: HttpClient) {
  }

  register(token: string): Promise<Account> {
    const url = `${this.BASE_URL}/registration`;
    return this.http
      .post<Account>(url, {}, {headers: this.authoriseHeader(token)})
      .catch((error: HttpErrorResponse) => {
        const serviceError = <RegistrationFailed>{};
        if ([403, 409].includes(error.status)) {
          serviceError.errorCode = RegistrationErrorCode.Duplication;
        } else {
          serviceError.errorCode = RegistrationErrorCode.ServiceError;
          serviceError.message = error.message;
        }
        return Observable.throwError(serviceError);
      }).toPromise();
  }

  private authoriseHeader(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
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
