import {Component, OnInit} from '@angular/core';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {Metadata} from '../../metadata-schema-form/models/metadata';
import {JsonSchema} from '../../metadata-schema-form/models/json-schema';
import {MetadataFormHelper} from '../../metadata-schema-form/models/metadata-form-helper';

@Component({
  selector: 'app-contact-field-group',
  templateUrl: './contact-field-group.component.html',
  styleUrls: ['./contact-field-group.component.css']
})
export class ContactFieldGroupComponent implements OnInit {
  metadataForm: MetadataForm;

  formHelper: MetadataFormHelper;

  contributorsControl: AbstractControl;
  contactFieldMetadataList: Metadata[];
  contributorMetadata: Metadata;

  contactKey = 'project.content.contributors';

  contactFieldList = [
    'project.content.contributors.email',
    'project.content.contributors.institution',
    'project.content.contributors.country',
    'project.content.contributors.project_role',
    'project.content.contributors.corresponding_contributor'
  ];

  constructor() {
    this.formHelper = new MetadataFormHelper();
  }

  ngOnInit(): void {
    this.contributorsControl = this.metadataForm.getControl(this.contactKey);
    this.contributorMetadata = this.metadataForm.get(this.contactKey);

    const fieldList = this.contactFieldList;

    this.contactFieldMetadataList = fieldList.map(field => {
      return this.metadataForm.get(field);
    });
  }

  removeFormControl(control: AbstractControl, i: number) {
    if (confirm('Are you sure?')) {
      const formArray = control as FormArray;
      formArray.removeAt(i);
    }
  }

  addFormControl(metadata: Metadata, formControl: AbstractControl) {
    const formArray = formControl as FormArray;
    const count = formArray.length;

    const formGroup: FormGroup = this.formHelper.toFormGroup(metadata.schema.items as JsonSchema);
    formArray.insert(count, formGroup);
  }
}
