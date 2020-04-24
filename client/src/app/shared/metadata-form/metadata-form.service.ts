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

  toFormGroup(jsonSchema: JsonSchema, config?: MetadataFormConfig, data?: object): FormGroup {
    const group: any = {};
    this.getFieldMap(jsonSchema, config).forEach((field: MetadataField, key: string) => {
      const subData = data !== undefined ? data[key] : undefined;
      if (field.isScalar()) {
        const formControl = this.toFormControl(field, subData);
        group[field.key] = formControl;
      } else if (field.isScalarList()) {
        const formArray = this.toFormControlArray(field, subData);
        group[field.key] = formArray;
      } else if (field.isObject()) {
        group[field.key] = this.toFormGroup(field.schema as JsonSchema, config, subData);
      } else if (field.isObjectList()) {
        group[field.key] = this.toFormGroupArray(field.schema.items as JsonSchema, config, subData);
      }
    });

    return new FormGroup(group);
  }

  toFormControl(field: MetadataField, data?: any) {
    const formControl = field.isRequired ? new FormControl(data, Validators.required)
      : new FormControl(data);
    return formControl;
  }

  toFormGroupArray(jsonSchema: JsonSchema, config?: MetadataFormConfig, data?: any[]): FormArray {
    const controlData = [];
    if (data && data.length > 0) {
      for (const elem of data) {
        const elemFormControl = this.toFormGroup(jsonSchema as JsonSchema, config, elem);
        controlData.push(elemFormControl);
      }
    } else {
      controlData.push(this.toFormGroup(jsonSchema as JsonSchema, config, undefined));
    }
    return new FormArray(controlData);
  }

  toFormControlArray(field, data?: any) {
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
  initializeFormConfig(formConfig: object, parentKey: string, jsonSchema: JsonSchema, config?: MetadataFormConfig, data?: object): object {
    const group: any = {};

    if (formConfig[parentKey] === undefined) {
      formConfig[parentKey] = {};
    }
    if (formConfig[parentKey]['children'] === undefined) {
      formConfig[parentKey]['children'] = [];
    }

    this.getFieldMap(jsonSchema, config).forEach((field: MetadataField, key: string) => {
      const configKey = parentKey ? parentKey + '.' + key : key;
      const subData = data && data[key] ? data[key] : undefined;
      formConfig[parentKey]['children'].push(configKey);

      if (formConfig[configKey] === undefined) {
        formConfig[configKey] = {};
      }

      if (field.isScalar()) {
        const formControl = this.toFormControl(field, subData);
        group[field.key] = formControl;
        formConfig[configKey]['field'] = field;
        formConfig[configKey]['type'] = FormControl;
        formConfig[configKey]['parent'] = parentKey;
        formConfig[configKey]['formControl'] = formControl;

      } else if (field.isScalarList()) {
        const formArray = this.toFormControlArray(field, subData);
        group[field.key] = formArray;
        formConfig[configKey]['field'] = field;
        formConfig[configKey]['type'] = FormArray;
        formConfig[configKey]['parent'] = parentKey;
        formConfig[configKey]['formControl'] = formArray;

      } else if (field.isObject()) {
        this.initializeFormConfig(formConfig, configKey, field.schema as JsonSchema, config, subData);
        const formGroup = this.toFormGroup(field.schema as JsonSchema, config, subData);
        group[field.key] = formGroup;

        formConfig[configKey]['formControl'] = formGroup;
        formConfig[configKey]['field'] = field;
        formConfig[configKey]['type'] = FormGroup;
        formConfig[configKey]['parent'] = parentKey;

      } else if (field.isObjectList()) {
        this.initializeFormConfig(formConfig, configKey, field.schema.items as JsonSchema, config, subData);
        const formArray = this.toFormGroupArray(field.schema.items as JsonSchema, config, subData);
        group[field.key] = formArray;
        formConfig[configKey]['formControl'] = formArray;
        formConfig[configKey]['field'] = field;
        formConfig[configKey]['type'] = FormArray;
        formConfig[configKey]['parent'] = parentKey;
      }
    });

    formConfig[parentKey]['formControl'] = new FormGroup(group);

    return formConfig;

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
