import {Component, Inject, OnInit} from '@angular/core';
import {MetadataFormConfig} from '../metadata-schema-form/models/metadata-form-config';
import {MetadataFormLayout} from '../metadata-schema-form/models/metadata-form-layout';
import {ActivatedRoute} from '@angular/router';
import {IngestService} from '../shared/services/ingest.service';
import {SchemaService} from '../shared/services/schema.service';
import {concatMap} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoaderService} from '../shared/services/loader.service';


export const layout: MetadataFormLayout = {
  tabs: [
    {
      title: 'biomaterial_core',
      key: 'donor_organism',
      items: [
        'donor_organism'
      ]
    }
    // {
    //   title: 'biomaterial_core',
    //   key: 'donor_organism',
    //   items: [
    //     'donor_organism.biomaterial_core'
    //   ]
    // },
    // {
    //   title: 'provenance',
    //   key: 'donor_organism.provenance',
    //   items: [
    //     'donor_organism.provenance'
    //   ]
    // },
    // {
    //   title: 'human_specific',
    //   key: 'donor_organism.human_specific',
    //   items: [
    //     'donor_organism.human_specific'
    //   ]
    // },
    // {
    //   title: 'mouse_specific',
    //   key: 'donor_organism.mouse_specific',
    //   items: [
    //     'donor_organism.mouse_specific'
    //   ]
    // },
    // {
    //   title: 'medical_history',
    //   key: 'donor_organism.medical_history',
    //   items: [
    //     'donor_organism.medical_history'
    //   ]
    // },
    // {
    //   title: 'gestational_age_unit',
    //   key: 'donor_organism.gestational_age_unit',
    //   items: [
    //     'donor_organism.gestational_age_unit'
    //   ]
    // }
  ]
};

@Component({
  selector: 'app-metadata-details',
  templateUrl: './metadata-details-dialog.component.html',
  styleUrls: ['./metadata-details-dialog.component.css']
})
export class MetadataDetailsDialogComponent implements OnInit {
  data: any;

// TODO alegria
//  1. dynamically generate a layout
//  2. support sections aside from tabs
//  3. add default layout when nothing is specified
//  4. add a loader while all information is being retrieved
//  5. check if you can have a more concise view :/
//  6. prioritise update entity and update links vs add entity and add links
//  7. for add, need a way to retrieve all types per domain entity
//  8. Component set - set of components to be used, define input types

  config: MetadataFormConfig = {
    // viewMode: true,
    hideFields: [
      'describedBy',
      'schema_version',
      'schema_type',
      'provenance'
    ],
    layout: layout,
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
    layout.tabs[0].key = concreteType;
    layout.tabs[0].items = [concreteType];
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
