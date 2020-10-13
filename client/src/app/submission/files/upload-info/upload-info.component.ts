import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-upload-info',
  templateUrl: './upload-info.component.html',
  styleUrls: ['./upload-info.component.css']
})
export class UploadInfoComponent implements OnInit {

  @Input() submissionEnvelope;
  uploadDetails: Object;

  constructor() { }

  ngOnInit() {
    this.uploadDetails = this.submissionEnvelope['stagingDetails'];
  }

  // I log Clipboard "copy" errors.
  public logError( error: Error ): void {

    console.group( 'Clipboard Error' );
    console.error( error );
    console.groupEnd();

  }


  // I log Clipboard "copy" successes.
  public logSuccess( value: string ): void {

    console.group( 'Clipboard Success' );
    console.groupEnd();

  }
}
