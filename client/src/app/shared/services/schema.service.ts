import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {IngestService} from './ingest.service';
import {MetadataSchema} from '../models/metadata-schema';
import {Observable, of} from 'rxjs';


@Injectable()
export class SchemaService {
  API_URL: string = environment.SCHEMA_API_URL;
  latestSchemaMap: Map<string, MetadataSchema>;


  constructor(private http: HttpClient, private ingestService: IngestService) {
    console.log('schema api url', this.API_URL);
  }

  public getLatestSchema(concreteType: string): Observable<MetadataSchema> {
    return this.getLatestSchemas().map(schemaMap => {
      let schema: MetadataSchema = schemaMap.get(concreteType);
      if (schema['_links']['json-schema']['href'].includes('humancellatlas.orgtype')) {
        schema['_links']['json-schema']['href'] = schema['_links']['json-schema']['href'].replace('humancellatlas.orgtype','humancellatlas.org/type');
      }
      return schema;
    });
  }

  private getLatestSchemas(): Observable<Map<string, MetadataSchema>> {
    if (this.latestSchemaMap) {
      return of(this.latestSchemaMap);
    }

    return this.ingestService.getLatestSchemas().map(data => {
      const schemas: MetadataSchema[] = data._embedded.schemas;
      const schemaMap: Map<string, MetadataSchema> = new Map<string, MetadataSchema>();
      for (const schema of schemas) {
        schemaMap.set(schema.concreteEntity, schema);
      }
      this.latestSchemaMap = schemaMap;
      return schemaMap;
    });
  }

}
