import {Component, Input, OnInit} from '@angular/core';
import {IngestService} from "../../shared/services/ingest.service";

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css']
})
export class SubmitComponent {
  @Input() submissionEnvelopeId;
  @Input() submissionEnvelope$;
  @Input() submitLink: string;
  @Input() isSubmitted: boolean;
  @Input() submissionUrl: string;
  @Input() isLinkingDone: boolean;
  @Input() manifest: object;
  triggersAnalysisCheck: boolean;


  constructor(private ingestService: IngestService) {
    this.triggersAnalysisCheck = true;
  }

  completeSubmission() {
    if(!this.triggersAnalysisCheck){
      this.ingestService.patch(this.submissionUrl, {triggersAnalysis: false}).subscribe(
        (response) => {
          console.log('patched submission');
          console.log("Response is: ", response);
          this.ingestService.submit(this.submitLink);
        },
        (error) => {
          console.error("An error occurred, ", error);
        });
    }
    else{
      console.log('complete submission');
      this.ingestService.submit(this.submitLink);
    }
  }

  getLinkingProgress(manifest){
    if(manifest){
      let percentage =  manifest['actualLinks']/manifest['expectedLinks'] * 100;
      return percentage | 0;
    }
    return 100;
  }

}
