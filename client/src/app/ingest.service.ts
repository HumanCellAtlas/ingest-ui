import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Submission} from './submission';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class IngestService {

  API_URL: string = 'https://betwwxbha9.execute-api.eu-west-2.amazonaws.com/dev';

  constructor(private http: HttpClient) {
  }

  public getAllSubmission(): Observable<Submission[]> {
    return this.http.get(`${this.API_URL}/submissions`)
      .map(data => _.values(data))
      .do(console.log);
  }

}
