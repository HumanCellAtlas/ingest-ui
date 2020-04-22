import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  getAccount(token: string): Observable<any> {
    let url = `${environment.INGEST_API_URL}/auth/account`;
    let headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.get(url, { headers: headers });
  }

}
