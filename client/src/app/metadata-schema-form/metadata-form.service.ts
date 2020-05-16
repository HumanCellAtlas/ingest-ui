import {Injectable} from '@angular/core';
import {JsonSchema} from './models/json-schema';
import {MetadataFormConfig} from './models/metadata-form-config';
import {MetadataForm} from './models/metadata-form';
import {MetadataFormHelper} from './models/metadata-form-helper';


@Injectable({providedIn: 'root'})
export class MetadataFormService {
  helper: MetadataFormHelper;

  constructor() {
  }

  createForm(entity: string, schema: JsonSchema, data: object, config: MetadataFormConfig) {
    const form = new MetadataForm('project', schema, data, config);
    return form;
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
