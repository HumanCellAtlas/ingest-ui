import {Injectable} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {JsonSchemaProperty} from './json-schema-property';
import {JsonSchema} from './json-schema';
import {MetadataField} from './metadata-field';


@Injectable({
  providedIn: 'root'
})
export class MetadataFormService {

  constructor() {
  }

  toFormGroup(jsonSchema: JsonSchema): FormGroup {
    const group: any = {};

    this.getFieldMap(jsonSchema).forEach((field: MetadataField, key: string) => {
      if (field.isScalar()) {
        const formControl = field.is_required ? new FormControl(undefined, Validators.required)
          : new FormControl();
        group[field.key] = formControl;
      } else if (field.isScalarList()) {
        const formControl = field.is_required ? new FormControl(undefined, Validators.required)
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

  getFieldMap(jsonSchema: JsonSchema): Map<string, MetadataField> {
    const metadataFieldMap = new Map<string, MetadataField>();
    for (const key of Object.keys(jsonSchema.properties)) {
      const property = this.getProperty(key, jsonSchema);
      const requiredFields = jsonSchema.required ? jsonSchema.required : [];
      const is_required = requiredFields.indexOf(key) >= 0;
      const metadataField = new MetadataField({is_required: is_required, key: key, schema: property});
      metadataFieldMap.set(key, metadataField);
    }
    return metadataFieldMap;
  }

  getProperty(key: string, jsonSchema: JsonSchema): JsonSchemaProperty {
    return jsonSchema.properties[key];
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
