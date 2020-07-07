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

  toFormGroup(metadata: Metadata, data?: object): FormGroup {
    const group: any = {};

    metadata.childrenMetadata.forEach((field: Metadata) => {
      const subData = data !== undefined ? data ? data[field.key] : null : undefined;
      if (field.isScalar()) {
        const formControl = this.toFormControl(field, subData);
        group[field.key] = formControl;
      } else if (field.isScalarList()) {
        const formArray = this.toFormControlArray(field, subData);
        group[field.key] = formArray;
      } else if (field.isObject()) {
        if (!field.isHidden) {
          group[field.key] = this.toFormGroup(field, subData);
        }
      } else if (field.isObjectList()) {
        const formGroupArray = this.toFormGroupArray(field, subData);
        group[field.key] = formGroupArray;
      }
    });

    const validators = metadata.isRequired ? [Validators.required] : [];
    return new FormGroup(group, validators);
  }

  toFormControl(field: Metadata, data?: any) {
    const state = {value: data, disabled: field && field.isDisabled};
    const formControl = field && field.isRequired ? new FormControl(state, Validators.required)
      : new FormControl(state);
    return formControl;
  }

  toFormGroupArray(metadata: Metadata, data?: any[]): FormArray {
    const controlData = [];
    if (data && data.length > 0) {
      for (const elem of data) {
        const elemFormControl = this.toFormGroup(metadata.itemMetadata, elem);
        controlData.push(elemFormControl);
      }
    }
    const validators = metadata.isRequired ? [Validators.required] : [];
    return new FormArray(controlData, validators);
  }

  toFormControlArray(field: Metadata, data?: any) {
    const controlData = [];
    if (data && data.length > 0) {
      for (const elem of data) {
        const elemFormControl = this.toFormControl(field, elem);
        controlData.push(elemFormControl);
      }
    }

    const validators = field.isRequired ? [Validators.required] : [];
    return new FormArray(controlData, validators);
  }
}
