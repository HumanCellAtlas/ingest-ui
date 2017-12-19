import {Component, Output, EventEmitter, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {BrokerService} from "../../broker.service";
import {Observable} from "rxjs/Observable";
import {UploadResults} from "../../models/uploadResults";
import {Router} from "@angular/router";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UploadComponent implements OnInit {

  @ViewChild('fileInput') fileInput;

  error$: Observable<String>;

  uploadResults$: Observable<UploadResults>;

  downloadFile:string;

  @Input() projectId;

  @Output() fileUpload = new EventEmitter();

  constructor(private brokerService: BrokerService,
              private router: Router,) {
    this.downloadFile = 'assets/xlsx-templates/Empty_template_v4.4.0_spreadsheet_PROJECTTAB.xlsx';
  }

  ngOnInit() {
  }

  resetMessages() {
    this.uploadResults$ = null;
    this.error$ = null;
  }

  upload() {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append("file", fileBrowser.files[0]);
      this.brokerService.uploadSpreadsheet(formData)
        .subscribe(
        data => {
          this.uploadResults$ = <any>data;
          //let submissionId = this.uploadResults$.details.submission_id;
          //let submissionsPath = `/submissions/detail/${submissionId}/overview`;
          //console.log('navigating to submissionsPath' + submissionsPath);
          //this.router.navigate([submissionsPath]);
        },
        err => {
          this.error$ = <any>err
        });
    }

  }
}
