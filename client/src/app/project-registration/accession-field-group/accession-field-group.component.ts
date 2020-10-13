import {Component, OnInit} from '@angular/core';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';
import {FormArray} from '@angular/forms';
import {MetadataFormHelper} from '../../metadata-schema-form/models/metadata-form-helper';

@Component({
  selector: 'app-accession-field-group',
  templateUrl: './accession-field-group.component.html',
  styleUrls: ['./accession-field-group.component.css']
})
export class AccessionFieldGroupComponent implements OnInit {
  metadataForm: MetadataForm;

  formHelper: MetadataFormHelper;

  isAccessioned: boolean | undefined;

  accessionId: string;

  accessionFields = [
    'project.content.array_express_accessions',
    'project.content.biostudies_accessions',
    'project.content.geo_series_accessions',
    'project.content.insdc_project_accessions',
    'project.content.insdc_study_accessions'
  ];

  defaultAccessionField = 'project.content.array_express_accessions';

  constructor() {
  }

  ngOnInit(): void {
    this.formHelper = new MetadataFormHelper();
  }

  onIsAccessionedChange(isAccessioned: string) {
    this.isAccessioned = isAccessioned === 'Yes';
    if (!this.isAccessioned) {
      this.clearAccessionFields();
    }
  }

  onProjectAccessionIdChange(accessionId: string) {
    this.clearAccessionFields();

    const defaultAccessionCtrl = this.metadataForm.getControl(this.defaultAccessionField);

    let matchedControl: FormArray = defaultAccessionCtrl as FormArray;
    for (const accessionFieldKey of this.accessionFields) {
      const metadata = this.metadataForm.get(accessionFieldKey);
      const control = this.metadataForm.getControl(accessionFieldKey) as FormArray;
      const accessionRegex = new RegExp(metadata.schema.items['pattern']);
      if (accessionRegex.test(accessionId)) {
        matchedControl = control;
        break;
      }
    }

    matchedControl.push(this.formHelper.toFormControl(undefined, accessionId));
  }

  clearAccessionFields(): void {
    this.accessionFields.map(accessionFieldKey => {
      const control = this.metadataForm.getControl(accessionFieldKey) as FormArray;
      control.reset();
    });
  }
}
