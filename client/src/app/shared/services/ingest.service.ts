import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {SubmissionEnvelope} from "./models/submissionEnvelope";
import {ListResult} from "./models/hateoas";
import {Summary} from "./models/summary";
import {Project} from "./models/project";
import {Metadata} from "./models/metadata";
import {AlertService} from "./alert.service";

@Injectable()
export class IngestService {

  // API_URL: string = 'http://api.ingest.integration.data.humancellatlas.org/';
  // API_URL: string = 'http://192.168.99.100:31763';
  // API_URL: string = 'http://api.ingest.dev.data.humancellatlas.org';
  API_URL: string = 'http://localhost:8080';

  constructor(private http: HttpClient, private alertService: AlertService) {
  }

  public getAllSubmissions(params): Observable<ListResult<SubmissionEnvelope>> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes`, {params: params})
      .do(console.log);
  }

  public getUserSubmissions(params): Observable<ListResult<SubmissionEnvelope>> {
    return this.http.get(`${this.API_URL}/user/submissionEnvelopes`, {params: params})
      .do(console.log);
  }

  public getSummary(): Observable<Summary> {
    return this.http.get(`${this.API_URL}/user/summary`)
      .map((data: Summary) => _.values(data))
      .do(console.log);
  }

  public getUserSummary(): Observable<Summary> {
    return this.http.get<Summary>(`${this.API_URL}/user/summary`).do(console.log);
  }

  public getProjects(): Observable<Project[]> {
    return this.http.get(`${this.API_URL}/projects`, {params: {'sort':'submissionDate,desc'}})
      .map((data: ListResult<Project>) => _.values(data._embedded.projects))
      .do(console.log);
  }

  public getUserProjects(): Observable<Project[]> {
    return this.http.get(`${this.API_URL}/user/projects`, {params: {'sort':'submissionDate,desc'}})
      .map((data: ListResult<Project>) => _.values(data._embedded.projects))
      .do(console.log);
  }

  public getFiles(id): Observable<Object[]> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${id}/files`)
      .map((data: ListResult<Object>) => {
        if(data._embedded && data._embedded.files)
          return _.values(data._embedded.files);
        else
          return [];
      })
      .do(console.log);
  }

  public getSamples(submissionEnvelopeId, params): Observable<Object> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${submissionEnvelopeId}/samples`, {params: params})
      .do(console.log);
  }

  public getSamples2(submissionEnvelopeId, params): Observable<ListResult<Metadata>> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${submissionEnvelopeId}/samples`, {params: params})
      .do(console.log);
  }

  public getAnalyses(id): Observable<Object[]> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${id}/analyses`)
      .map((data: ListResult<Object>) => {
        if(data._embedded && data._embedded.analyses)
          return _.values(data._embedded.analyses);
        else
          return [];
      })
      .do(console.log);
  }

  public getAssays(id): Observable<Object[]> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${id}/assays`)
      .map((data: ListResult<Object>) => {
        if(data._embedded && data._embedded.assays)
          return _.values(data._embedded.assays);
        else
          return [];
      })
      .do(console.log);
  }

  //there was no pagination, check core code
  public getBundles(id): Observable<Object[]> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${id}/bundleManifests`)
      .map((data: ListResult<Object>) => {
        if(data._embedded && data._embedded.bundleManifests)
          return _.values(data._embedded.bundleManifests);
        else
          return [];
      })
      .do(console.log);
  }

  public getProtocols(id): Observable<Object[]> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${id}/protocols`)
      .map((data: ListResult<Object>) => {
        if(data._embedded && data._embedded.protocols)
          return _.values(data._embedded.protocols);
        else
          return [];
      })
  }

  public submit(submitLink){
    this.http.put(submitLink, null).subscribe(
      res=> {
        this.alertService.success('You have successfully submitted your submission envelope.');
        location.reload();
      },
      err => {
        console.log(err)
      }
    )
  }

  public getSubmission(id): Observable<SubmissionEnvelope>{
    return this.http.get<SubmissionEnvelope>(`${this.API_URL}/submissionEnvelopes/${id}`);
  }

  public getProject(id): Observable<Object> {
    return this.http.get(`${this.API_URL}/projects/${id}`);
  }

  public postProject(project): Observable<Object>{
    return this.http.post(`${this.API_URL}/projects`, project);
  }

  public putProject(id, project): Observable<Object>{
    return this.http.put(`${this.API_URL}/projects/${id}`, project);
  }

  public getSubmissionProject(submissionId): Observable<Object> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${submissionId}/projects`)
      .map((data: ListResult<Object>) => {
        if(data._embedded && data._embedded.projects)
          return _.values(data._embedded.projects)[0]; // there should only be one project linked to the submission env
        else
          return {};
      })
      .do(console.log);

  }


}
