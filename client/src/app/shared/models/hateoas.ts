import {Page} from './page';

export interface ListResult<T> {
  _embedded: EmbeddedList<T>;
  _links: any;
  page: Page;
}

export interface EmbeddedList<T> {
  submissionEnvelopes: T[];
  projects: T[];
  files: T[];
  biomaterials: T[];
  protocols: T[];
  processes: T[];
  bundleManifests: T[];
  schemas: T[];
  archiveEntities: T[];
  archiveSubmissions: T[];
}
