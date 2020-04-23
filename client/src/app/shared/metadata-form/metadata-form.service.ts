import {Injectable} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {JsonSchemaProperty} from './json-schema-property';
import {JsonSchema} from './json-schema';
import {MetadataField} from './metadata-field';
import {MetadataFormConfig} from './metadata-form-config';


@Injectable({
  providedIn: 'root'
})
export class MetadataFormService {
  config: object = {};

  constructor() {
  }

  toFormGroup(jsonSchema: JsonSchema, config?: MetadataFormConfig): FormGroup {
    const group: any = {};

    this.getFieldMap(jsonSchema, config).forEach((field: MetadataField, key: string) => {
      if (field.isScalar()) {
        const formControl = field.isRequired ? new FormControl(undefined, Validators.required)
          : new FormControl();
        group[field.key] = formControl;
      } else if (field.isScalarList()) {
        const formControl = field.isRequired ? new FormControl(undefined, Validators.required)
          : new FormControl();
        group[field.key] = new FormArray([formControl]);
      } else if (field.isObject()) {
        group[field.key] = this.toFormGroup(field.schema as JsonSchema);
      } else if (field.isObjectList()) {
        const formGroup = this.toFormGroup(field.schema.items as JsonSchema);
        group[field.key] = new FormArray([formGroup]);
      }
    });

    return new FormGroup(group);
  }

  getFieldMap(jsonSchema: JsonSchema, config?: MetadataFormConfig): Map<string, MetadataField> {
    const metadataFieldMap = new Map<string, MetadataField>();
    if (jsonSchema === null || jsonSchema === undefined) {
      return metadataFieldMap;
    }
    for (const key of Object.keys(jsonSchema.properties)) {
      const property = this.getProperty(key, jsonSchema);
      const requiredFields = jsonSchema.required ? jsonSchema.required : [];
      const hiddenFields = config && config.hideFields ? config.hideFields : [];
      const disabledFields = config && config.disableFields ? config.hideFields : [];
      const isRequired = requiredFields.indexOf(key) >= 0;
      const isHidden = hiddenFields.indexOf(key) >= 0;
      const isDisabled = disabledFields.indexOf(key) >= 0;
      const metadataField = new MetadataField({
        isRequired: isRequired,
        isHidden: isHidden,
        isDisabled: isDisabled,
        key: key,
        schema: property
      });

      metadataFieldMap.set(key, metadataField);
    }
    return metadataFieldMap;
  }

  getProperty(key: string, jsonSchema: JsonSchema): JsonSchemaProperty {
    return jsonSchema.properties[key];
  }

  // TODO try to refactor
  buildFormConfig(parentKey: string, jsonSchema: JsonSchema, config?: MetadataFormConfig): object {
    const group: any = {};

    if (this.config[parentKey] === undefined) {
      this.config[parentKey] = {};
    }
    if (this.config[parentKey]['children'] === undefined) {
      this.config[parentKey]['children'] = [];
    }

    this.getFieldMap(jsonSchema, config).forEach((field: MetadataField, key: string) => {
      const configKey = parentKey ? parentKey + '.' + key : key;

      this.config[parentKey]['children'].push(configKey);

      if (this.config[configKey] === undefined) {
        this.config[configKey] = {};
      }

      if (field.isScalar()) {
        const formControl = field.isRequired ? new FormControl(undefined, Validators.required)
          : new FormControl();
        group[field.key] = formControl;

        this.config[configKey]['field'] = field;
        this.config[configKey]['type'] = FormControl;
        this.config[configKey]['parent'] = parentKey;

      } else if (field.isScalarList()) {
        const formControl = field.isRequired ? new FormControl(undefined, Validators.required)
          : new FormControl();
        const formArray = new FormArray([formControl]);
        group[field.key] = formArray;

        this.config[configKey]['field'] = field;
        this.config[configKey]['type'] = FormArray;
        this.config[configKey]['parent'] = parentKey;
        this.config[configKey]['formControl'] = formArray;

      } else if (field.isObject()) {
        this.buildFormConfig(configKey, field.schema as JsonSchema, config);
        const formGroup = this.config[configKey]['formControl'];
        group[field.key] = formGroup;

        this.config[configKey]['formControl'] = formGroup;
        this.config[configKey]['field'] = field;
        this.config[configKey]['type'] = FormGroup;
        this.config[configKey]['parent'] = parentKey;

      } else if (field.isObjectList()) {
        this.buildFormConfig(configKey, field.schema.items as JsonSchema, config);
        const formGroup = this.config[configKey]['formControl'];
        const formArray = new FormArray([formGroup]);
        group[field.key] = formArray;

        this.config[configKey]['formControl'] = formArray;
        this.config[configKey]['field'] = field;
        this.config[configKey]['type'] = FormArray;
        this.config[configKey]['parent'] = parentKey;
      }
    });

    this.config[parentKey]['formControl'] = new FormGroup(group);

    return this.config;
  }

  cleanFormData(formData: any): object {
    if (!formData) {
      return formData;
    }
    return this.copyValues(formData);
  }

  copyValues(obj: any): object {
    let copy = null;
    let subCopy = null;

    if (this.isEmpty(obj)) {
      copy = null;
    } else if (Array.isArray(obj)) {
      copy = [];
      for (const elem of obj) {
        subCopy = this.copyValues(elem);
        if (!this.isEmpty(subCopy)) {
          copy.push(subCopy);
        }
      }
    } else if (typeof obj === 'object') {
      copy = {};
      for (const key of Object.keys(obj)) {
        const prop = obj[key];
        subCopy = this.copyValues(prop);
        if (!this.isEmpty(subCopy)) {
          copy[key] = subCopy;
        }
      }
    } else {
      subCopy = obj;
      if (!this.isEmpty(subCopy)) {
        copy = subCopy;
      }
    }
    return copy;
  }

  isEmpty(obj: any): boolean {
    if (obj === undefined || obj === null) {
      return true;
    }

    if (Array.isArray(obj) && obj.length === 0) {
      return true;
    }

    if (typeof obj === 'number' && obj !== null) {
      return false;
    }

    if (typeof obj === 'object' && Object.keys(obj).length === 0) {
      return true;
    }
    return false;
  }
}
