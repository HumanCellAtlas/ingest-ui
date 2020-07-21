import {JsonSchema} from './json-schema';
import {MetadataFormConfig} from './metadata-form-config';
import {Metadata} from './metadata';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MetadataFormHelper} from './metadata-form-helper';
import {MetadataRegistry} from './metadata-registry';


export class MetadataForm {
  metadataRegistry: MetadataRegistry;
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
    this.metadataRegistry = new MetadataRegistry(key, jsonSchema, config);
    this.config = config;
    this.helper = new MetadataFormHelper(config);
    this.initForm(this);
  }

  get(key: string): Metadata | undefined {
    return this.metadataRegistry.get(key);
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
    this.formGroup = this.helper.toFormGroup(this.get(this.key), form.data);
    return form;
  }


}

