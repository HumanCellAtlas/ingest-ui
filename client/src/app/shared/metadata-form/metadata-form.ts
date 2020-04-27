import {JsonSchema} from './json-schema';
import {MetadataFormConfig} from './metadata-form-config';
import {Metadata} from './metadata';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {JsonSchemaProperty} from './json-schema-property';

export class MetadataForm {
  content: object;
  key: string;
  jsonSchema: JsonSchema;
  data: any;

  constructor(key: string, jsonSchema: JsonSchema, data?: any) {
    this.key = key;
    this.jsonSchema = jsonSchema;
    this.data = data;
    this.content = {};
  }

  get(key: string): Metadata | undefined {
    return this.content[key];
  }
}

export class MetadataFormHelper {
  content: object;
  config: MetadataFormConfig;

  constructor(config?: MetadataFormConfig) {
    this.config = config;
  }

  initForm(form: MetadataForm): MetadataForm {
    this.content = form.content
    this._build(form.key, form.jsonSchema, form.data);
    return form;
  }

  _build(parentKey: string, jsonSchema: JsonSchema, data?: object): object {
    const group: any = {};

    const formConfig = this.content;

    if (formConfig[parentKey] === undefined) {
      formConfig[parentKey] = {};
    }
    if (formConfig[parentKey]['children'] === undefined) {
      formConfig[parentKey]['children'] = [];
    }

    this.getFieldMap(jsonSchema).forEach((field: Metadata, key: string) => {
      const configKey = parentKey ? parentKey + '.' + key : key;
      const subData = data && data[key] ? data[key] : undefined;
      field.addChild(configKey);
      field.setParent(parentKey);
      formConfig[parentKey]['children'].push(configKey);


      if (formConfig[configKey] === undefined) {
        formConfig[configKey] = {};
      }

      if (formConfig[configKey]['field'] === undefined) {
        formConfig[configKey] = {};
      }

      formConfig[configKey]['parent'] = parentKey;
      if (field.isScalar()) {
        const formControl = this.toFormControl(field, subData);
        group[field.key] = formControl;

        formConfig[configKey]['field'] = field;
        formConfig[configKey]['formControl'] = formControl;

      } else if (field.isScalarList()) {
        const formArray = this.toFormControlArray(field, subData);
        group[field.key] = formArray;
        formConfig[configKey]['field'] = field;
        formConfig[configKey]['formControl'] = formArray;

      } else if (field.isObject()) {
        this._build(configKey, field.schema as JsonSchema, subData);
        const formGroup = this.toFormGroup(field.schema as JsonSchema, subData);
        group[field.key] = formGroup;

        formConfig[configKey]['formControl'] = formGroup;
        formConfig[configKey]['field'] = field;

      } else if (field.isObjectList()) {
        this._build(configKey, field.schema.items as JsonSchema, subData);
        const formArray = this.toFormGroupArray(field.schema.items as JsonSchema, subData);
        group[field.key] = formArray;
        formConfig[configKey]['formControl'] = formArray;
        formConfig[configKey]['field'] = field;
      }
    });

    formConfig[parentKey]['formControl'] = new FormGroup(group);

    return formConfig;

  }


  getFieldMap(jsonSchema: JsonSchema): Map<string, Metadata> {
    const config = this.config;
    const metadataFieldMap = new Map<string, Metadata>();
    for (const key of Object.keys(jsonSchema.properties)) {
      const property = this.getProperty(key, jsonSchema);
      const requiredFields = jsonSchema.required ? jsonSchema.required : [];
      const hiddenFields = config && config.hideFields ? config.hideFields : [];
      const disabledFields = config && config.disableFields ? config.hideFields : [];
      const isRequired = requiredFields.indexOf(key) >= 0;
      const isHidden = hiddenFields.indexOf(key) >= 0;
      const isDisabled = disabledFields.indexOf(key) >= 0;
      const metadataField = new Metadata({
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
    const formControl = field.isRequired ? new FormControl(data, Validators.required)
      : new FormControl(data);
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
}
