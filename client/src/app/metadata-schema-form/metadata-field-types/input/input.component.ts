import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {Metadata} from '../../models/metadata';
import {MetadataFormHelper} from '../../models/metadata-form-helper';
import pluralize from 'pluralize';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
  selector: 'app-input-field',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent extends BaseInputComponent implements OnInit {
  formHelper: MetadataFormHelper;

  constructor() {
    super();
    this.formHelper = new MetadataFormHelper();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  singularize(word: string) {
    return pluralize.singular(word);
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

    const formGroup: FormGroup = this.formHelper.toFormGroup(metadata.itemMetadata);
    formArray.insert(count, formGroup);
  }

}
