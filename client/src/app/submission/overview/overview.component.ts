import {Component, Input, OnInit} from '@angular/core';
import {IngestService} from "../../shared/services/ingest.service";
import {ActivatedRoute} from "@angular/router";
import {BrokerService} from "../../shared/services/broker.service";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  @Input() projectId;
  @Input() submissionEnvelopeId;
  @Input() project;

  constructor(private ingestService: IngestService, private route: ActivatedRoute, private brokerService: BrokerService) { }

  ngOnInit(){
  }

  downloadFile(){
    this.brokerService.downloadSpreadsheet(this.submissionEnvelopeId).subscribe(spreadsheet => {
      console.log("downloaded file!")
      var newBlob = new Blob([spreadsheet]);

      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const data = window.URL.createObjectURL(newBlob);

      var link = document.createElement('a');
      link.href = data;
      link.download = `${this.submissionEnvelopeId}.xslx`;
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    });
  }
}
