import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {SubmissionEnvelope} from "./models/submissionEnvelope";
import {ListResult} from "./models/hateoas";
import {Summary} from "../home/welcome/summary";
import {Project} from "./models/project";
import {Metadata} from "./models/metadata";

@Injectable()
export class IngestService {

  //API_URL: string = 'http://192.168.99.100:31763';
  API_URL: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  public getAllSubmissions(): Observable<SubmissionEnvelope[]> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes`, {params: {'sort':'submissionDate,desc'}})
      .map((data: ListResult<SubmissionEnvelope>) => _.values(data._embedded.submissionEnvelopes))
      .do(console.log);
  }

  public getAllSubmissionsHAL(): Observable<ListResult<SubmissionEnvelope>> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes`)
      .map((data: ListResult<SubmissionEnvelope>) => _.values(data))
      .do(console.log);
  }

  public pollSubmissions():  Observable<SubmissionEnvelope[]> {
    return Observable.interval(5000).switchMap(() => this.getAllSubmissions());
  }

  public pollSubmissionsHAL():  Observable<ListResult<SubmissionEnvelope>> {
    return Observable.interval(5000).switchMap(() => this.getAllSubmissionsHAL());
  }

  public getSummary(): Observable<Summary> {
    return this.http.get(`${this.API_URL}/user/summary`)
      .map((data: Summary) => _.values(data))
      .do(console.log);
  }

  public getAllProjects(): Observable<Project[]> {
    return this.http.get(`${this.API_URL}/projects`)
      .map((data: ListResult<Project>) => _.values(data._embedded.projects))
      .do(console.log);
  }

  public getAllFiles(id): Observable<Object[]> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${id}/files`)
      .map((data: ListResult<Object>) => _.values(data._embedded.files))
      .do(console.log);
  }

  public submit(submitLink){
    this.http.put(submitLink, null).subscribe(
      res=> {
        console.log(res)
      },
      err => {
        console.log(err)
      }
    )
  }

  public getSubmission(id): Observable<SubmissionEnvelope>{
    return this.http.get<SubmissionEnvelope>(`${this.API_URL}/submissionEnvelopes/${id}`);
  }

  public postProject(newProject) {
    this.http.post(`${this.API_URL}/projects`, newProject).subscribe(
      res=> {
         console.log(res)
      },
      err => {
         console.log(err)
      }
    )
  }
}
