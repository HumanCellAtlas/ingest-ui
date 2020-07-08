import {Component, Input, OnInit} from '@angular/core';
import {Metadata} from '../../metadata-schema-form/models/metadata';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';
import {MetadataFormHelper} from '../../metadata-schema-form/models/metadata-form-helper';

@Component({
  selector: 'app-publication-field-group',
  templateUrl: './publication-field-group.component.html',
  styleUrls: ['./publication-field-group.component.css']
})
export class PublicationFieldGroupComponent implements OnInit {
  @Input()
  metadataForm: MetadataForm;

  formHelper: MetadataFormHelper;

  publicationUrlMetadata: Metadata;
  publicationUrlControl: AbstractControl;

  publicationUrlId = 'project.content.publications.url';
  publicationKey = 'project.content.publications';

  constructor() {
    this.formHelper = new MetadataFormHelper();
  }

  ngOnInit(): void {
    this.publicationUrlMetadata = this.metadataForm.get(this.publicationUrlId);
    const publicationsControl = this.metadataForm.getControl(this.publicationKey);
    const publicationsMetadata = this.metadataForm.get(this.publicationKey);
    this.addFormControl(publicationsMetadata, publicationsControl);
    this.publicationUrlControl = publicationsControl['controls'][0]['controls']['url'];

    const publication = publicationsControl['controls'][0] as FormGroup;
    publication.removeControl('authors');
    publication.removeControl('title');
  }

  addFormControl(metadata: Metadata, formControl: AbstractControl) {
    const formArray = formControl as FormArray;
    const count = formArray.length;

    const formGroup: FormGroup = this.formHelper.toFormGroup(metadata.itemMetadata);
    formArray.insert(count, formGroup);
  }
}
