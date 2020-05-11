import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OlsHttpResponse} from '../models/ols';


@Injectable({
  providedIn: 'root'
})
export class OntologyService {
  API_URL: string = environment.OLS_URL;

  constructor(private http: HttpClient) {
    console.log('ols url', this.API_URL);
  }

  select(params): Observable<OlsHttpResponse> {
    return this.http.get(`${this.API_URL}/api/select`, {params: params})
      .map(response => response as OlsHttpResponse);
  }

}
