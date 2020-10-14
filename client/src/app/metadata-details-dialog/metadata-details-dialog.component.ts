import {Component, Inject, OnInit} from '@angular/core';
import {MetadataFormConfig} from '../metadata-schema-form/models/metadata-form-config';
import {MetadataFormLayout} from '../metadata-schema-form/models/metadata-form-layout';
import {ActivatedRoute} from '@angular/router';
import {IngestService} from '../shared/services/ingest.service';
import {SchemaService} from '../shared/services/schema.service';
import {concatMap} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoaderService} from '../shared/services/loader.service';

@Component({
  selector: 'app-metadata-details',
  templateUrl: './metadata-details-dialog.component.html',
  styleUrls: ['./metadata-details-dialog.component.css']
})
export class MetadataDetailsDialogComponent implements OnInit {
  data: any;

  config: MetadataFormConfig = {
    hideFields: [
      'describedBy',
      'schema_version',
      'schema_type',
      'provenance'
    ],
    showCancelButton: false,
    showResetButton: false,
    submitButtonLabel: 'Save'
  };

  schema: object;
  schemaUrl: string;
  formTabKey: any;

  type: string;
  id: string;

  constructor(private route: ActivatedRoute,
              private ingestService: IngestService,
              private schemaService: SchemaService,
              private loaderService: LoaderService,
              public dialogRef: MatDialogRef<MetadataDetailsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: any) {
  }

  ngOnInit(): void {
    this.data = this.dialogData['metadata']['content'];
    console.log('content', this.dialogData['metadata']['content']);
    this.schemaUrl = this.dialogData['metadata']['content']['describedBy'];
    this.schema = this.dialogData['schema'];
    const concreteType = this.schemaUrl.split('/').pop();
    const layout: MetadataFormLayout = {
      tabs: [
        {
          title: 'biomaterial_core',
          key: 'donor_organism',
          items: [
            'donor_organism'
          ]
        }
      ]
    };

    layout.tabs[0].key = concreteType;
    layout.tabs[0].items = [concreteType];
    this.config.layout = layout;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCancel($event: boolean) {

  }

  onBack($event: boolean) {

  }

  onSave($event: object) {

  }

  onTabChange($event: string) {

  }
}
