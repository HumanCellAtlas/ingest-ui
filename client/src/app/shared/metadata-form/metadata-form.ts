import {JsonSchema} from './json-schema';
import {MetadataFormConfig} from './metadata-form-config';
import {Metadata} from './metadata';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {JsonSchemaProperty} from './json-schema-property';

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

  initForm(form: MetadataForm): MetadataForm {
    this.formGroup = this.helper.toFormGroup(form.jsonSchema as JsonSchema, form.data);
    this.buildMetadataRegistry('project', form.jsonSchema as JsonSchema);
    return form;
  }

  buildMetadataRegistry(parentKey: string, jsonSchema: JsonSchema): void {
    const formConfig = this.metadataRegistry;
    const config = this.config;

    let parentMetadata;
    if (formConfig[parentKey] === undefined) {
      parentMetadata = new Metadata({
        key: parentKey,
        schema: jsonSchema as JsonSchemaProperty
      });
      formConfig[parentKey] = parentMetadata;
    } else {
      parentMetadata = formConfig[parentKey];
    }
    for (const key of Object.keys(jsonSchema.properties)) {
      let metadata: Metadata;
      const configKey = parentKey ? parentKey + '.' + key : key;
      if (formConfig[configKey] === undefined) {
        const property = this.helper.getProperty(key, jsonSchema);
        const requiredFields = jsonSchema.required ? jsonSchema.required : [];
        const hiddenFields = this.config && this.config.hideFields ? this.config.hideFields : [];
        const disabledFields = this.config && this.config.disableFields ? this.config.disableFields : [];
        const isRequired = requiredFields.indexOf(key) >= 0;
        const isHidden = hiddenFields.indexOf(key) >= 0;
        const isDisabled = config && config.viewMode || disabledFields.indexOf(key) >= 0;
        metadata = new Metadata({
          isRequired: isRequired,
          isHidden: isHidden,
          isDisabled: isDisabled,
          key: key,
          schema: property
        });
        formConfig[configKey] = metadata;
      } else {
        metadata = formConfig[configKey];
      }

      parentMetadata.addChild(configKey);
      metadata.setParent(parentKey);
      metadata.setParentMetadata(parentMetadata);

      if (metadata.isScalar()) {
      } else if (metadata.isScalarList()) {

      } else if (metadata.isObject()) {
        this.buildMetadataRegistry(configKey, metadata.schema as JsonSchema);

      } else if (metadata.isObjectList()) {
        this.buildMetadataRegistry(configKey, metadata.schema.items as JsonSchema);

      }
    }

  }

}

export class MetadataFormHelper {
  config: MetadataFormConfig;

  constructor(config?: MetadataFormConfig) {
    this.config = config;
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
      const isDisabled = config && config.viewMode || disabledFields.indexOf(key) >= 0;
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
