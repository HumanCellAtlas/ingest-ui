import {Component, Input} from '@angular/core';
import {IngestService} from '../../shared/services/ingest.service';
import {LoaderService} from '../../shared/services/loader.service';
import {AlertService} from '../../shared/services/alert.service';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css']
})
export class SubmitComponent {
  @Input() project$;
  @Input() submissionEnvelopeId;
  @Input() submissionEnvelope$;
  @Input() submitLink: string;
  @Input() exportLink: string;
  @Input() cleanupLink: string;
  @Input() isSubmitted: boolean;
  @Input() submissionUrl: string;
  @Input() isLinkingDone: boolean;
  @Input() manifest: object;
  submitToArchives: boolean;
  submitToDcp: boolean;
  cleanup: boolean;


  constructor(private ingestService: IngestService,
              private loaderService: LoaderService,
              private alertService: AlertService) {
    this.submitToArchives = true;
    this.submitToDcp = true;
    this.cleanup = true;
  }

  onSubmit() {
    const submitActions = [];

    if (this.submitToArchives) {
      submitActions.push('Archive');
    }

    if (this.submitToDcp) {
      submitActions.push('Export');
    }

    if (this.cleanup) {
      submitActions.push('Cleanup');
    }

    console.log('submitActions', submitActions);

    if (!this.submitToDcp && !this.submitToArchives) {
      alert('You should either submit to archives or to HCA.');
    } else if (!this.submitToDcp && this.cleanup) {
      alert('The upload area cannot be deleted yet, the data files are needed for submitting to HCA.');
    } else {
      this.requestSubmit(this.submitLink, submitActions);
    }

  }

  requestSubmit(submitLink, submitActions: string[]) {
    this.loaderService.display(true);
    this.ingestService.put(submitLink, submitActions).subscribe(
      res => {
        setTimeout(() => {
            this.alertService.clear();
            this.loaderService.display(false);
            this.alertService.success('', 'You have successfully submitted your submission envelope.');
          },
          3000);
      },
      err => {
        this.loaderService.display(false);
        this.alertService.error('', 'An error occurred on submitting your submission envelope.', true);
        console.log(err);

      }
    );
  }

  requestExport() {
    this.ingestService.put(this.exportLink, undefined)
      .subscribe(
        res => {
          setTimeout(() => {
              this.alertService.clear();
              this.loaderService.display(false);
              this.alertService.success('', 'Your submission envelope should start exporting shortly.');
            },
            3000);
        },
        err => {
          this.loaderService.display(false);
          this.alertService.error('', 'An error occurred on the request to export your submission envelope.');
          console.log(err);

        }
      );
  }

  requestCleanup() {
    if (confirm('Are you sure you?')) {
      this.ingestService.put(this.cleanupLink, undefined)
        .subscribe(
          res => {
            setTimeout(() => {
                this.alertService.clear();
                this.loaderService.display(false);
                this.alertService.success('', 'Your submission envelope upload area will now be deleted.');
              },
              3000);
          },
          err => {
            this.loaderService.display(false);
            this.alertService.error('', 'An error occurred on the request to clean up the upload area of your submission envelope.');
            console.log(err);

          }
        );
    }
  }


  getLinkingProgress(manifest) {
    if (manifest) {
      const percentage = manifest['actualLinks'] / manifest['expectedLinks'] * 100;
      return percentage || 0;
    }
    return 100;
  }

}
