export interface ArchiveSubmission {
  created: string;
  dspUuid: string;
  dspUrl: string;
  submissionUuid?: any;
  fileUploadPlan: any[];
  errors: any[];
  _links: object;
}
