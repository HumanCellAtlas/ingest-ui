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
    "/type/project/5.0.0/project",
    "/type/protocol/5.0.0/protocol",
    "/type/protocol/analysis/5.0.0/analysis_protocol",
    "/type/protocol/biomaterial/5.0.0/biomaterial_collection_protocol",
    "/type/protocol/imaging/5.0.0/imaging_protocol",
    "/type/protocol/sequencing/5.0.0/sequencing_protocol"
  ];

  JSON_BASIC_TYPES = ['string', 'number', 'integer', 'boolean', 'null'];

  fields: object = {};

  constructor(private http: HttpClient) {
    console.log('schema api url', this.API_URL);
    this.initializeSchemaFields();
    console.log('schema fields', this.fields)
  }

  // TODO can we generate the column definitions json only during the build?
  initializeSchemaFields(){
    if(Object.keys(this.fields)){
      for(let schemaType of this.SCHEMA_TYPES){
        let schemaId = this.API_URL + schemaType
        let schemaTypeKey = schemaId.split('/').pop();
        this.fields[schemaTypeKey] = {};
        this.recurseSchemaFields(this.fields[schemaTypeKey], schemaTypeKey, schemaId);
      }
    }
  }

  recurseSchemaFields(fieldMap, parentFieldName, schemaId){
    this.getSchema(schemaId).subscribe(schema => {
      schema = this.getSubSchema(schemaId, schema);

      let requiredFields = schema['required'];
      let schemaProperties = schema['properties'];

      for(let fieldName in schemaProperties) {
        let field = schemaProperties[fieldName];
        field['isRequired'] = requiredFields.indexOf(fieldName) >=0;

        let prefix = parentFieldName;
        let key = prefix ? prefix + '.' + fieldName : fieldName;

        if(this.JSON_BASIC_TYPES.indexOf(field['type']) >= 0){
          fieldMap[key] = field;

        } else if(field['type'] === 'object') {
          fieldMap[key] = field;
          let subSchemaId = field['$ref'];
          this.recurseSchemaFields(fieldMap, key, subSchemaId);

        } else if(field['type'] === 'array') {
          if(typeof field['items'] === 'object' && field['items']['$ref']){
            fieldMap[key] = field;
            let subSchemaId = field['items']['$ref'];
            this.recurseSchemaFields(fieldMap, key, subSchemaId);
          } else {
            fieldMap[key] = field;
          }
        }
      }
    });
  }

  /**  Gets specific schema snippet if there's a schema snippet reference in schemaId
   i.e. https://schema.humancellatlas.org/bundle/5.0.0/biomaterial#/definitions/biomaterial_ingest
   The pound symbol (#) refers to the current document, and then the slash (/) separated keys thereafter just traverse the keys in the objects in the document.
   Therefore, in our example "#/definitions/address" means:

   1. go to the root of the document
   2. find the value of the key "definitions"
   3. within that object, find the value of the key "address"
   */

  getSubSchema(schemaId, schema){

    let subSchemaPath = schemaId.split('#').length > 1 ? schemaId.split('#').pop() : null;

    if(subSchemaPath){
      let keys = subSchemaPath.split('/');
      keys.shift(); // skip the blank string split result from first slash

      for(let key of keys){
        schema = schema[key];
      }
    }
    return schema;
  }

  getSchema(schemaId): Observable<object> {
    let schemaUrl = schemaId;
    return this.http.get(schemaUrl);
  }

  getColumnDefinition(entity, entityType, columnName){

    return this.fields[entityType][columnName] || {};
  }


}
