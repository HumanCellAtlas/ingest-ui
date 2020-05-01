import {MetadataFormConfig} from './metadata-form-config';
import {JsonSchema} from './json-schema';
import {Metadata} from './metadata';
import {JsonSchemaProperty} from './json-schema-property';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

export class MetadataFormHelper {
  config: MetadataFormConfig;

  constructor(config?: MetadataFormConfig) {
    this.config = config;
  }

  getFieldMap(jsonSchema: JsonSchema): Map<string, Metadata> {
    const metadataFieldMap = new Map<string, Metadata>();
    for (const key of Object.keys(jsonSchema.properties)) {
      const metadataField = this.createMetadata(jsonSchema, key);
      metadataFieldMap.set(key, metadataField);
    }
    return metadataFieldMap;
  }

  createMetadata(jsonSchema: JsonSchema, key: string): Metadata {
    const property = this.getProperty(key, jsonSchema);
    const requiredFields = jsonSchema.required ? jsonSchema.required : [];
    const hiddenFields = this.config && this.config.hideFields ? this.config.hideFields : [];
    const disabledFields = this.config && this.config.disableFields ? this.config.hideFields : [];
    const isRequired = requiredFields.indexOf(key) >= 0;
    const isHidden = hiddenFields.indexOf(key) >= 0;
    const isDisabled = this.config && this.config.viewMode || disabledFields.indexOf(key) >= 0;
    const metadataField = new Metadata({
      isRequired: isRequired,
      isHidden: isHidden,
      isDisabled: isDisabled,
      key: key,
      schema: property
    });
    return metadataField;
  }

  getProperty(key: string, jsonSchema: JsonSchema): JsonSchemaProperty {
    return jsonSchema.properties[key];
  }

  toFormGroup(jsonSchema: JsonSchema, data?: object): FormGroup {
    const group: any = {};
    this.getFieldMap(jsonSchema).forEach((field: Metadata, key: string) => {
      const subData = data !== undefined ? data[key] : undefined;
      if (field.isScalar()) {
        const formControl = this.toFormControl(field, subData);
        group[field.key] = formControl;
      } else if (field.isScalarList()) {
        const formArray = this.toFormControlArray(field, subData);
        group[field.key] = formArray;
      } else if (field.isObject()) {
        group[field.key] = this.toFormGroup(field.schema as JsonSchema, subData);
      } else if (field.isObjectList()) {
        group[field.key] = this.toFormGroupArray(field.schema.items as JsonSchema, subData);
      }
    });

    return new FormGroup(group);
  }

  toFormControl(field: Metadata, data?: any) {
    const state = {value: data, disabled: field.isDisabled};
    const formControl = field.isRequired ? new FormControl(state, Validators.required)
      : new FormControl(state);
    return formControl;
  }

  toFormGroupArray(jsonSchema: JsonSchema, data?: any[]): FormArray {
    const controlData = [];
    if (data && data.length > 0) {
      for (const elem of data) {
        const elemFormControl = this.toFormGroup(jsonSchema as JsonSchema, elem);
        controlData.push(elemFormControl);
      }
    } else {
      controlData.push(this.toFormGroup(jsonSchema as JsonSchema, undefined));
    }
    return new FormArray(controlData);
  }

  toFormControlArray(field: Metadata, data?: any) {
    const controlData = [];
    if (data && data.length > 0) {
      for (const elem of data) {
        const elemFormControl = this.toFormControl(field, elem);
        controlData.push(elemFormControl);
      }
    } else {
      controlData.push(this.toFormControl(field, undefined));
    }
    return new FormArray(controlData);
  }

}
