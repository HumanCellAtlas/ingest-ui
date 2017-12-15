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

@Injectable()
export class IngestService {

  API_URL: string = 'http://api.ingest.integration.data.humancellatlas.org/';
  // API_URL: string = 'http://192.168.99.100:31763';
  // API_URL: string = 'http://api.ingest.dev.data.humancellatlas.org';
  // API_URL: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {
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

  public getFiles(id): Observable<Object[]> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${id}/files`)
      .map((data: ListResult<Object>) => _.values(data._embedded.files))
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
      .map((data: ListResult<Object>) => _.values(data._embedded.assays))
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

  public getProject(id): Observable<Object> {
    return this.http.get(`${this.API_URL}/projects/id`);
  }

  public postProject(newProject) {
    let project = {
      "core" : {
        "type": "project",
        "schema_url": "https://raw.githubusercontent.com/HumanCellAtlas/metadata-schema/4.1.0/json_schema/project.json"
      },
    }

    for (let key in newProject){
      project[key] = newProject[key];
    }

    this.http.post(`${this.API_URL}/projects`, project).subscribe(
      res=> {
         console.log(res)
      },
      err => {
         console.log(err)
      }
    )
  }
}
