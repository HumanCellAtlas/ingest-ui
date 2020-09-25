import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {IngestService} from './ingest.service';
import {MetadataSchema} from '../models/metadata-schema';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class SchemaService {
  API_URL: string = environment.SCHEMA_API_URL;
  latestSchemaMap: Map<string, MetadataSchema>;

  constructor(private http: HttpClient, private ingestService: IngestService) {
    console.log('schema api url', this.API_URL);
  }

  public getUrlOfLatestSchema(concreteType: string): Observable<string> {
    return this.getLatestSchemas().pipe(map(schemaMap => {
      const schema: MetadataSchema = schemaMap.get(concreteType);
      const schemaUrl = schema['_links']['json-schema']['href'];
      if (schemaUrl.includes('humancellatlas.orgtype')) {
        return schemaUrl.replace('humancellatlas.orgtype', 'humancellatlas.org/type');
      }
      return schemaUrl;
    }));
  }

  private getLatestSchemas(): Observable<Map<string, MetadataSchema>> {
    if (this.latestSchemaMap) {
      return of(this.latestSchemaMap);
    }

    return this.ingestService.getLatestSchemas().pipe(map(data => {
      const schemas: MetadataSchema[] = data._embedded.schemas;
      const schemaMap: Map<string, MetadataSchema> = new Map<string, MetadataSchema>();
      for (const schema of schemas) {
        schemaMap.set(schema.concreteEntity, schema);
      }
      this.latestSchemaMap = schemaMap;
      return schemaMap;
    }));
  }
}
