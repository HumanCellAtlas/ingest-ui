export interface SubmissionEnvelope {
  uuid: string;
  submissionDate: string;
  updateDate: string;
  submissionState: string;
  stagingDetails: Object;
  open: boolean;
}
