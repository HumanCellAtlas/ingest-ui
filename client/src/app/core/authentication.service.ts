import {Observable} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {CoreSecurity} from "./security.module";
import {Account} from "../shared/models/account";

@Injectable({
  providedIn: CoreSecurity,
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  private readonly BASE_URL = `${environment.INGEST_API_URL}/auth`;

  getAccount(token: string): Promise<Account> {
    const url = `${this.BASE_URL}/account`;
    return this.http
      .get<Account>(url, {headers: this.authoriseHeader(token)})
      .catch((error: HttpErrorResponse) => {
        return Observable.throwError(<Account>{});
      }).toPromise();
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

  name: string = 'RegistrationFailed';
  message: string = 'Account registration failed';
  errorCode: RegistrationErrorCode = RegistrationErrorCode.Unknown;

}
