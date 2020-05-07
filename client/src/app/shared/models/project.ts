import {MetadataDocument} from './metadata-document';

export interface Project extends MetadataDocument {
  hasOpenSubmission: boolean;
  releaseDate?: string;
  accessionDate?: string;

  _links: object;
}

