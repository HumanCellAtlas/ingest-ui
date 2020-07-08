import {MetadataFormLayout} from './metadata-form-layout';

export interface MetadataFormConfig {
  hideFields?: string[];
  removeEmptyFields?: boolean;
  disableFields?: string[];
  viewMode?: boolean;
  layout?: MetadataFormLayout;
  inputType?: object;
  overrideRequiredFields?: {[key: string]: boolean};
  submitButtonLabel?: string;
}
