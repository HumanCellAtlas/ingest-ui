export interface Project {
  content: object;
  submissionDate: string;
  updateDate: string;
  user?: any;
  lastModifiedUser: string;
  type: string;
  uuid: Uuid;
  events: any[];
  dcpVersion: string;
  accession?: any;
  validationState: string;
  validationErrors: any[];
  isUpdate: boolean;
  hasOpenSubmission: boolean;
  _links: object;
}

interface Uuid {
  uuid: string;
}
