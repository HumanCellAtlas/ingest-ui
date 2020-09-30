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
import {MetadataSchema} from '../models/metadata-schema';
import {Account} from '../../core/account';
import {Project} from '../models/project';
import {ArchiveSubmission} from '../models/archiveSubmission';
import {ArchiveEntity} from '../models/archiveEntity';


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

  public getUserAccount(): Observable<Account> {
    return this.http.get(`${this.API_URL}/auth/account`).map(data => new Account({
      id: data['id'],
      providerReference: data['providerReference'],
      roles: data['roles']
    }));
  }

  public deleteSubmission(submissionId) {
    return this.http.delete(`${this.API_URL}/submissionEnvelopes/${submissionId}`);
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

  public queryProjects(query: Object[], params?): Observable<any> {
    return this.http.post(`${this.API_URL}/projects/query`, query, {params: params});
  }

  public patchProject(projectResource, patch, partial: boolean = false): Observable<Object> {
    const projectLink: string = projectResource['_links']['self']['href'] + `?partial=${partial}`;
    patch['validationState'] = 'Draft';
    return this.http.patch(projectLink, patch);
  }

  public getSubmissionProject(submissionId): Observable<Project> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${submissionId}/projects`)
      .map((data: ListResult<Object>) => {
        if (data._embedded && data._embedded.projects) {
          return _.values(data._embedded.projects)[0];
        } else {
          return null;
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

  public put(ingestLink, body) {
    return this.http.put(ingestLink, body);
  }

  public patch(ingestLink, patchData) {
    return this.http.patch(ingestLink, patchData);
  }

  public get(url): Observable<Object> {
    return this.http.get(url);
  }

  public getLatestSchemas(): Observable<ListResult<MetadataSchema>> {
    return this.get(`${this.API_URL}/schemas/search/filterLatestSchemas?highLevelEntity=type`)
      .map(data => data as ListResult<MetadataSchema>);
  }

  public getArchiveSubmission(submissionUuid: string): Observable<ArchiveSubmission> {
    return this.get(`${this.API_URL}/archiveSubmissions/search/findBySubmissionUuid?submissionUuid=${submissionUuid}`)
      .map(data => {
        const archiveSubmissions = data['_embedded']['archiveSubmissions'];
        // TODO Adjust the UI to be able to display all archive submissions
        // just display the last
        let archiveSubmission: ArchiveSubmission;
        if (archiveSubmissions.length > 0) {
          const idx = archiveSubmissions.length - 1;
          archiveSubmission = archiveSubmissions[idx];
        }
        return archiveSubmission;
      });
  }

  public getArchiveEntity(dspUuid: string): Observable<ArchiveEntity> {
    return this.get(`${this.API_URL}/archiveEntities/search/findByDspUuid?dspUuid=${dspUuid}`)
      .map(data => data as ArchiveEntity);
  }

  private reduceColumnsForBundleManifests(entityType, data) {
    if (entityType === 'bundleManifests') {
      return data.map(function (row) {
        const newRow = {
          '_links': row['_links'],
          'dataFiles': row['dataFiles']
        };
        return newRow;
      });
    }
    return data;


  }
}
