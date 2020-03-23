import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import * as _ from 'lodash';

import {AlertService} from './alert.service';
import {ListResult} from '../models/hateoas';
import {Summary} from '../models/summary';
import {PagedData} from '../models/page';
import {SubmissionEnvelope} from '../models/submissionEnvelope';

import {environment} from '../../../environments/environment';
import {LoaderService} from './loader.service';
import {MetadataDocument} from '../models/metadata-document';


@Injectable()
export class IngestService {

  API_URL: string = environment.INGEST_API_URL;

  constructor(private http: HttpClient, private alertService: AlertService, private loaderService: LoaderService) {
    console.log('api url', this.API_URL);
  }

  public getAllSubmissions(params): Observable<any> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes`, {params: params});
  }

  public getUserSubmissions(params): Observable<any> {
    return this.http.get(`${this.API_URL}/user/submissionEnvelopes`, {params: params});
  }

  public getUserSummary(): Observable<Summary> {
    return this.http.get<Summary>(`${this.API_URL}/user/summary`);
  }

  public getProjects(params): Observable<any> {
    return this.http.get(`${this.API_URL}/projects`, {params: params});
  }

  public getUserProjects(params): Observable<any> {
    return this.http.get(`${this.API_URL}/user/projects`, {params: params});
  }

  public deleteSubmission(submissionId) {
    return this.http.delete(`${this.API_URL}/submissionEnvelopes/${submissionId}`);
  }

  public submit(submitLink) {
    this.loaderService.display(true);
    this.http.put(submitLink, null).subscribe(
      res => {
        setTimeout(() => {
            this.alertService.clear();
            this.loaderService.display(false);
            this.alertService.success('', 'You have successfully submitted your submission envelope.');
            location.reload();
          },
          3000);
      },
      err => {
        this.loaderService.display(false);
        this.alertService.error('', 'An error occured on submitting your submission envelope.');
        console.log(err);

      }
    );
  }

  public getSubmission(id): Observable<SubmissionEnvelope> {
    return this.http.get<SubmissionEnvelope>(`${this.API_URL}/submissionEnvelopes/${id}`);
  }

  public getSubmissionByUuid(uuid): Observable<SubmissionEnvelope> {
    return this.http.get<SubmissionEnvelope>(`${this.API_URL}/submissionEnvelopes/search/findByUuidUuid?uuid=${uuid}`);
  }

  public getProject(id): Observable<Object> {
    return this.http.get(`${this.API_URL}/projects/${id}`);
  }

  public deleteProject(id: string): Observable<Object> {
    return this.http.delete(`${this.API_URL}/projects/${id}`);
  }

  public getProjectByUuid(uuid): Observable<Object> {
    return this.http.get(`${this.API_URL}/projects/search/findByUuid?uuid=${uuid}`);
  }

  public getSubmissionManifest(submissionId): Observable<Object> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${submissionId}/submissionManifest`);
  }

  public postProject(project): Observable<Object> {
    return this.http.post(`${this.API_URL}/projects`, project);
  }

  public queryProjects(query: Object[], params): Observable<any> {
    return this.http.post(`${this.API_URL}/projects/query`, query, {params: params});
  }

  public patchProject(projectResource, project): Observable<Object> {
    const projectLink: string = projectResource['_links']['self']['href'];
    return this.http.patch(projectLink, {content: project});
  }

  public getSubmissionProject(submissionId): Observable<Object> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${submissionId}/projects`)
      .map((data: ListResult<Object>) => {
        if (data._embedded && data._embedded.projects) {
          return _.values(data._embedded.projects)[0];
        } // there should only be one project linked to the submission env
        else {
          return {};
        }
      });
  }

  public fetchSubmissionData(submissionId, entityType, filterState, params): Observable<PagedData<MetadataDocument>> {
    let url = `${this.API_URL}/submissionEnvelopes/${submissionId}/${entityType}`;
    const submission_url = `${this.API_URL}/submissionEnvelopes/${submissionId}`;

    const sort = params['sort'];
    if (sort) {
      url = `${this.API_URL}/${entityType}/search/findBySubmissionEnvelope`;
      params['envelopeUri'] = encodeURIComponent(submission_url);
      params['sort'] = `${sort['column']},${sort['dir']}`;
    }

    if (filterState) {
      url = `${this.API_URL}/${entityType}/search/findBySubmissionEnvelopeAndValidationState`;
      params['envelopeUri'] = encodeURIComponent(submission_url);
      params['state'] = filterState.toUpperCase();

    }
    return this.http.get(url, {params: params})
      .map((data: ListResult<MetadataDocument>) => {
        const pagedData: PagedData<MetadataDocument> = {data: [], page: undefined};
        if (data._embedded && data._embedded[entityType]) {
          pagedData.data = _.values(data._embedded[entityType]);
          pagedData.data = this.reduceColumnsForBundleManifests(entityType, pagedData.data);
        } else {
          pagedData.data = [];
        }
        pagedData.page = data.page;
        return pagedData;
      });
  }

  public put(ingestLink, content) {
    return this.http.put(ingestLink, content);
  }

  public patch(ingestLink, patchData) {
    return this.http.patch(ingestLink, patchData);
  }

  public get(url): Observable<Object> {
    return this.http.get(url);
  }

  private reduceColumnsForBundleManifests(entityType, data) {
    if (entityType === 'bundleManifests') {
      return data.map(function (row) {
        const newRow = {
          'bundleUuid': row['bundleUuid'],
          'version': row['bundleVersion'],
          'envelopeUuid': row['envelopeUuid'],
          '_links': row['_links'],
          '_dss_bundle_url': `${environment.DSS_API_URL}/v1/bundles/${row['bundleUuid']}/?replica=aws&version${row['bundleVersion']}`
        };
        return newRow;
      });
    }
    return data;


  }
}
