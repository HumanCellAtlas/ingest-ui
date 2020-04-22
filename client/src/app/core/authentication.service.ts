import {Observable} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  getAccount(token: string): Observable<any> {
    const url = `${environment.INGEST_API_URL}/auth/account`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http
      .get(url, {headers: headers})
      .catch((error: HttpErrorResponse) => {
        return Observable.of({});
      });
  }

}
