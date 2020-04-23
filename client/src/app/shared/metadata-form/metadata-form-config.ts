import {MetadataField} from "./metadata-field";

export interface MetadataFormConfig {
  hideFields?: string[];
  removeEmptyFields?: boolean;
  disableFields?: string[];
  customFieldType?: object;
}

