import {Component, Output, EventEmitter, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {BrokerService} from "../../services/broker.service";
import {Observable} from "rxjs";
import {UploadResults} from "../../models/uploadResults";
import {Router} from "@angular/router";
import {AlertService} from "../../services/alert.service";
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UploadComponent implements OnInit {

  @ViewChild('fileInput') fileInput;
  @ViewChild('projectIdInput') projectIdInput;

  error$: Observable<String>;

  uploadResults$: Observable<UploadResults>;

  downloadFile:string;

  @Input() projectId;

  @Output() fileUpload = new EventEmitter();

  @Input() isUpdate = false;

  constructor(private brokerService: BrokerService,
              private router: Router,
              private alertService: AlertService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
    if(this.projectId){
      this.downloadFile = 'assets/xlsx-templates/Empty_template_v4.6.1_spreadsheet_NOPROJECTTAB.xlsx';
    } else {
      this.downloadFile = 'assets/xlsx-templates/Empty_template_v4.6.1_spreadsheet_PROJECTTAB.xlsx';
    }
  }

  upload() {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      this.loaderService.display(true);
      const formData = new FormData();
      formData.append("file", fileBrowser.files[0]);

      let projectId = this.projectIdInput.nativeElement.value;

      if(projectId){
        formData.append("project_id", projectId );
      }

      this.brokerService.uploadSpreadsheet(formData, this.isUpdate)
        .subscribe(
        data => {
          this.uploadResults$ = <any>data;
          let submissionId = this.uploadResults$['details']['submission_id'];
          let submissionsPath = `/submissions/detail/${submissionId}/overview`;

          this.router.navigate([submissionsPath]);
          this.alertService.success("", this.uploadResults$['message']);
          this.loaderService.display(false);
        },
        err => {
          this.error$ = <any>err
          this.alertService.error(this.error$['message'], this.error$['details']);
          this.loaderService.display(false);
        });
    }

  }
}
