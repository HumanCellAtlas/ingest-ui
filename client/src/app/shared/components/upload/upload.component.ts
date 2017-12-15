import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {BrokerService} from "../../broker.service";
import {Observable} from "rxjs/Observable";
import {UploadResults} from "../../models/uploadResults";

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

  constructor(private brokerService: BrokerService) {
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
          data => this.uploadResults$ = <any>data,
          err => this.error$ = <any>err
        );
    }
  }
}
