import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import { environment } from '../../../environments/environment';


@Injectable()
export class SchemaService {
  API_URL: string = environment.SCHEMA_API_URL;

  // TODO: Is it possible to get schema types from SCHEMA API?
  SCHEMA_TYPES = [
    "/type/biomaterial/5.0.0/cell_line",
    "/type/biomaterial/5.0.0/cell_suspension",
    "/type/biomaterial/5.0.0/donor_organism",
    "/type/biomaterial/5.0.0/organoid",
    "/type/biomaterial/5.0.0/specimen_from_organism",
    "/type/file/5.0.0/analysis_file",
    "/type/file/5.0.0/sequence_file",
    "/type/process/analysis/5.0.0/analysis_process",
    "/type/process/biomaterial_collection/5.0.0/collection_process",
    "/type/process/biomaterial_collection/5.0.0/dissociation_process",
    "/type/process/biomaterial_collection/5.0.0/enrichment_process",
    "/type/process/imaging/5.0.0/imaging_process",
    "/type/process/sequencing/5.0.0/library_preparation_process",
    "/type/process/sequencing/5.0.0/sequencing_process",
    "/type/project/5.0.1/project",
    "/type/protocol/5.0.0/protocol",
    "/type/protocol/analysis/5.0.0/analysis_protocol",
    "/type/protocol/biomaterial/5.0.0/biomaterial_collection_protocol",
    "/type/protocol/imaging/5.0.0/imaging_protocol",
    "/type/protocol/sequencing/5.0.0/sequencing_protocol"
  ]

  JSON_BASIC_TYPES = ['string', 'number', 'integer', 'boolean', 'null'];

  fields = {};

  constructor(private http: HttpClient) {
    console.log('schema api url', this.API_URL);
  }


  initializeSchemaFields(){
    if(Object.keys(this.fields)){
      for(let schemaType of this.SCHEMA_TYPES){
        let schemaId = this.API_URL + schemaType;
        let schemaTypePrefix = schemaId.split('/').pop();
        this.recurseSchemaFields(schemaTypePrefix, schemaId);
      }
      console.log('SCHEMA FIELDS', this.fields);
    }
  }

  recurseSchemaFields(parentFieldName, schemaId){
    // TODO: Fix SAME ORIGIN POLICY ERROR, replace original api url by github url for now
    schemaId = schemaId.replace( this.API_URL, 'https://raw.githubusercontent.com/HumanCellAtlas/metadata-schema/master/json_schema')
    schemaId = schemaId.replace('5.0.0/', '');
    schemaId = schemaId + '.json';

    // TODO handle schema url values like https://schema.humancellatlas.org/bundle/1.0.0/file#/definitions/file_ingest
    this.getSchema(schemaId).subscribe(schema => {
      let schemaProperties = schema['properties'];

      for(let fieldName in schemaProperties) {
        let field = schemaProperties[fieldName];

        let prefix = parentFieldName;
        let key = prefix ? prefix + '.' + fieldName : fieldName;

        if(this.JSON_BASIC_TYPES.indexOf(field['type']) >= 0){
          this.fields[key] = field;
        } else if(field['type'] === 'object') {

          this.fields[key] = field;
          let subSchemaId = field['$ref'];
          this.recurseSchemaFields(key, subSchemaId);

        } else if(field['type'] === 'array') {
          if(typeof field['items'] === 'object' && field['items']['$ref']){

              this.fields[key] = field;
              let subSchemaId = field['items']['$ref'];
              this.recurseSchemaFields(key, subSchemaId);

          } else {
            this.fields[key] = field;
          }
        }
      }
    });
  }

  getSchema(url): Observable<Object> {
    return this.http.get(url);
  }

  getSchemaFields(){
    return this.fields;
  }

  getSchemaFieldDefinition(fieldName){
    return this.fields[fieldName];
  }

  getSchemaUrl(path, version, name){
    return `$API_URL/$path/$version/$name`;
  }
}
