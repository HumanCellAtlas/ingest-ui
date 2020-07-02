import {MetadataDocument} from './metadata-document';

export interface Project extends MetadataDocument {
  hasOpenSubmission: boolean;
  releaseDate?: string;
  accessionDate?: string;
  primaryWrangler?: string;
  _links: object;
}

export const enum ProjectColumn {
  api_link,
  short_name,
  project_title,
  last_updated,
  primary_contributor,
  primary_wrangler,
}
