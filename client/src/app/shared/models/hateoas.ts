export interface ListResult<T> {
  _embedded: EmbeddedList<T>;
  _links: any;
  page: any;
}

export interface EmbeddedList<T> {
  submissionEnvelopes: T[];
  projects: T[];
  files: T[];
  samples: T[];
  analyses: T[];
  assays: T[];
  protocols: T[];
  bundleManifests: T[];
  schemas: T[];
}
