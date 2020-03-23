import {MetadataDocument} from './metadata-document';

export interface Project extends MetadataDocument {
  hasOpenSubmission: boolean;
  _links: object;
}
