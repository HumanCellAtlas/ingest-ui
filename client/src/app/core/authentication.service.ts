import {Observable} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  private readonly URL = `${environment.INGEST_API_URL}/auth/account`;

  getAccount(token: string): Observable<any> {
    return this.http
      .get(this.URL, {headers: this.authoriseHeader(token)})
      .catch((error: HttpErrorResponse) => {
        return Observable.of({});
      });
  }

  register(token: string): Observable<any> {
    return this.http.post(this.URL, {}, {headers: this.authoriseHeader(token)});
  }

  private authoriseHeader(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

}
