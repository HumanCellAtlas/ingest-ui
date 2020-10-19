import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MetadataFormConfig} from '../metadata-schema-form/models/metadata-form-config';
import {MetadataFormLayout, MetadataFormTab} from '../metadata-schema-form/models/metadata-form-layout';
import {ActivatedRoute} from '@angular/router';
import {IngestService} from '../shared/services/ingest.service';
import {SchemaService} from '../shared/services/schema.service';
import {concatMap, tap} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoaderService} from '../shared/services/loader.service';
import {MetadataDocument} from '../shared/models/metadata-document';
import {Observable, of} from 'rxjs';
import {ListResult} from '../shared/models/hateoas';
import {MetadataFormComponent} from '../metadata-schema-form/metadata-form/metadata-form.component';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-metadata-details',
  templateUrl: './metadata-details-dialog.component.html',
  styleUrls: ['./metadata-details-dialog.component.css']
})
export class MetadataDetailsDialogComponent implements OnInit {
  content: any;
  metadata: MetadataDocument;

  @ViewChild(MetadataFormComponent) metadataFormComponent: MetadataFormComponent;

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

  inputBiomaterials: MetadataDocument[];

  constructor(private route: ActivatedRoute,
              private ingestService: IngestService,
              private schemaService: SchemaService,
              private loaderService: LoaderService,
              private alertService: AlertService,
              public dialogRef: MatDialogRef<MetadataDetailsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: any) {
  }

  ngOnInit(): void {
    this.metadata = this.dialogData['metadata'];
    this.content = this.metadata.content;
    console.log('content', this.content);
    this.type = this.metadata['type'];
    this.id = this.metadata['uuid']['uuid'];

    this.schemaUrl = this.dialogData['metadata']['content']['describedBy'];
    this.schema = this.dialogData['schema'];
    const concreteType = this.schemaUrl.split('/').pop();
    const layout: MetadataFormLayout = {
      tabs: []
    };

    const tab: MetadataFormTab = {
      items: [concreteType], key: concreteType, title: ''
    };

    layout.tabs = [tab];
    this.config.layout = layout;
    this.getInputBiomaterials(this.metadata).subscribe();
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
        this.alertService.clear();
        this.alertService.success('Success',
          `${this.type} ${this.id} has been successfully updated`);
        this.dialogRef.close();
      }, err => {
        this.alertService.clear();
        this.alertService.success('Error',
          `${this.type} ${this.id} has not been updated due to ${err.toString()}`);
        this.dialogRef.close();
      });

  }

  addInput() {
    console.log('add input');
  }

  getInputBiomaterials(metadata: MetadataDocument): Observable<ListResult<MetadataDocument>> {
    const selfUrl = metadata._links['self']['href'];
    return this.ingestService.getAs<ListResult<MetadataDocument>>(`${selfUrl}/inputBiomaterials`).pipe(
      tap(data => {
        const inputs = data._embedded ? data._embedded.biomaterials : [];
        this.inputBiomaterials = inputs;
      }));
  }

  removeInput(input: MetadataDocument) {
    console.log('remove input');
  }
}
