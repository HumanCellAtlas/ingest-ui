import {JsonSchema} from './json-schema';
import {MetadataFormConfig} from './metadata-form-config';
import {Metadata} from './metadata';
import {AbstractControl, FormGroup} from '@angular/forms';
import {JsonSchemaProperty} from './json-schema-property';
import {MetadataFormHelper} from './metadata-form-helper';

export class MetadataForm {
  metadataRegistry: object;
  key: string;
  jsonSchema: JsonSchema;
  data: any;
  config: MetadataFormConfig;
  helper: MetadataFormHelper;
  formGroup: FormGroup;

  constructor(key: string, jsonSchema: JsonSchema, data?: any, config?: MetadataFormConfig) {
    this.key = key;
    this.jsonSchema = jsonSchema;
    this.data = data;
    this.metadataRegistry = {};
    this.config = config;
    this.helper = new MetadataFormHelper(config);
    this.initForm(this);
  }

  get(key: string): Metadata | undefined {
    return this.metadataRegistry[key];
  }

  getControl(key: string, rootControl?: AbstractControl): AbstractControl {
    let control: AbstractControl;
    try {
      const fieldParts = key.split('.');


      if (!rootControl) {
        control = this.formGroup;
      } else {
        control = rootControl;
      }

      fieldParts.shift();

      for (const part of fieldParts) {
        control = control['controls'][part];
      }

    } catch (e) {
      console.error('Could not find form control for ' + key, e);
    }
    return control;
  }

  initForm(form: MetadataForm): MetadataForm {
    this.formGroup = this.helper.toFormGroup(form.jsonSchema as JsonSchema, form.data);
    this.buildMetadataRegistry(form.key, form.jsonSchema as JsonSchema);
    return form;
  }

  buildMetadataRegistry(parentKey: string, jsonSchema: JsonSchema): void {
    const registry = this.metadataRegistry;

    let parentMetadata;
    if (registry[parentKey] === undefined) {
      parentMetadata = new Metadata({
        key: parentKey,
        schema: jsonSchema as JsonSchemaProperty
      });
      registry[parentKey] = parentMetadata;
    } else {
      parentMetadata = registry[parentKey];
    }

    for (const key of Object.keys(jsonSchema.properties)) {
      let metadata: Metadata;
      const metadataKey = parentKey ? parentKey + '.' + key : key;
      if (registry[metadataKey] === undefined) {
        metadata = this.helper.createMetadata(jsonSchema, key);
        registry[metadataKey] = metadata;
      } else {
        metadata = registry[metadataKey];
      }

      parentMetadata.addChild(metadataKey);
      parentMetadata.addChildMetadata(metadata);
      metadata.setParent(parentKey);
      metadata.setParentMetadata(parentMetadata);

      if (parentMetadata.isHidden) {
        metadata.setHidden(true);
      }

      if (metadata.isScalar()) {
      } else if (metadata.isScalarList()) {

      } else if (metadata.isObject()) {
        this.buildMetadataRegistry(metadataKey, metadata.schema as JsonSchema);

      } else if (metadata.isObjectList()) {
        this.buildMetadataRegistry(metadataKey, metadata.schema.items as JsonSchema);

      }
    }
  }
}

