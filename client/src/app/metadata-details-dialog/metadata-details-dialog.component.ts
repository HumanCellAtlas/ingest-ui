import {Component, Inject, OnInit} from '@angular/core';
import {MetadataFormConfig} from '../metadata-schema-form/models/metadata-form-config';
import {MetadataFormLayout} from '../metadata-schema-form/models/metadata-form-layout';
import {ActivatedRoute} from '@angular/router';
import {IngestService} from '../shared/services/ingest.service';
import {SchemaService} from '../shared/services/schema.service';
import {concatMap} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoaderService} from '../shared/services/loader.service';
import {MetadataDocument} from '../shared/models/metadata-document';

@Component({
  selector: 'app-metadata-details',
  templateUrl: './metadata-details-dialog.component.html',
  styleUrls: ['./metadata-details-dialog.component.css']
})
export class MetadataDetailsDialogComponent implements OnInit {
  content: any;
  metadata: MetadataDocument;

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
    this.metadata = this.dialogData['metadata'];
    this.content = this.metadata.content;
    console.log('content', this.content);

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

  onSave(formData: object) {
    console.log('saving data', formData);
    const selfLink = this.metadata._links['self']['href'];
    const newContent = formData['value'];
    this.metadata['content'] = newContent;
    this.metadata['validationState'] = 'Draft';
    this.ingestService.patch(selfLink, this.metadata)
      .subscribe(response => {
        console.log('successful update', response);
        this.dialogRef.close();
      }, err => {
        console.error('error', err);
        this.dialogRef.close();
      });

  }

}
