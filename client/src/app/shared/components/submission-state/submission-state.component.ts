import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-submission-state',
  templateUrl: './submission-state.component.html',
  styleUrls: ['./submission-state.scss']
})
export class SubmissionStateComponent implements OnInit {
  @Input()
  state: string;

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * Return the CSS class name corresponding to the current submission state value, for styling the submission state
   * chip.
   *
   * @param submissionState {string}
   * @returns {string}
   */
  getStateChipClassName(submissionState: string): string {

    if (submissionState === 'Pending' || submissionState === 'Draft') {
      return 'warning';
    }

    if (submissionState === 'Valid') {
      return 'success';
    }

    if (submissionState === 'Validating') {
      return 'info';
    }

    if (submissionState === 'Invalid') {
      return 'danger';
    }

    if (submissionState === 'Submitted') {
      return 'secondary';
    }

    if (submissionState === 'Processing'
      || submissionState === 'Cleanup'
      || submissionState === 'Archiving'
      || submissionState === 'Exporting') {
      return 'warning-invert';
    }

    if (submissionState === 'Complete' || submissionState === 'Exported' || submissionState === 'Archived') {
      return 'success-invert';
    }

    return 'secondary';
  }
}
