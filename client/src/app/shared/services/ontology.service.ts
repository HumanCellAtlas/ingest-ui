import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {combineLatest, Observable, of} from 'rxjs';
import {OlsHttpResponse} from '../models/ols';
import {JsonSchema} from '../../metadata-schema-form/models/json-schema';
import {Ontology} from '../models/ontology';
import {concatMap, map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class OntologyService {
  API_URL: string = environment.OLS_URL;

  OLS_RELATION: object = {
    'rdfs:subClassOf': 'allChildrenOf'
  };

  constructor(private http: HttpClient) {
    console.log('ols url', this.API_URL);
  }

  lookup(schema: JsonSchema, searchText: string): Observable<Ontology[]> {
    return this
      .createSearchParams(schema, searchText).pipe(concatMap(params => this.searchOntologies(params)));
  }

  createSearchParams(schema: JsonSchema, searchText?: string): Observable<object> {
    const searchParams = {
      groupField: 'iri',
      start: 0,
      ontology: 'efo',
      q: searchText ? searchText : '*',
      rows: 30 // TODO max result we have for project role and technology is 27,
      // increasing the rows for now to let the users see all the options
    };

    if (!schema) {
      return of(searchParams);
    }

    const properties = schema.properties;
    const graphRestriction = properties['ontology']['graph_restriction'];
    const ontologyClasses: string[] = graphRestriction['classes'];
    const ontologyRelation: string = graphRestriction['relations'][0]; // TODO support only 1 relation for now

    return combineLatest(ontologyClasses
      .map(ontologyClass => ontologyClass.replace(':', '_'))
      .map(olsClass => this.select({q: olsClass}))
    ).pipe(
      map(responses => responses
        .map(ols => ols.response)
        .filter(olsResponse => olsResponse.numFound === 1)
        .map(olsResponse => olsResponse.docs[0].iri)),
      map(iriArray => {
        searchParams[this.OLS_RELATION[ontologyRelation]] = iriArray;
        return searchParams;
      })
    );
  }

  searchOntologies(params): Observable<Ontology[]> {
    return this.select(params).pipe(map(result => {
      return result.response.docs.map(doc => {
        const ontology: Ontology = {
          ontology: doc.obo_id,
          ontology_label: doc.label,
          text: doc.label
        };
        return ontology;
      });
    }));
  }

  select(params): Observable<OlsHttpResponse> {
    return this.http.get(`${this.API_URL}/api/select`, {params: params})
      .pipe(map(response => response as OlsHttpResponse));
  }


}
