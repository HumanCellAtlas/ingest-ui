import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {Metadata} from '../../metadata';
import {MetadataFormHelper} from '../../metadata-form-helper';
import pluralize from 'pluralize';
import {JsonSchema} from "../../json-schema";

@Component({
  selector: 'app-input-field',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  metadata: Metadata;
  control: AbstractControl;
  id: string;

  formHelper: MetadataFormHelper;

  constructor() {
    this.formHelper = new MetadataFormHelper();
  }

  ngOnInit(): void {
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

    const formGroup: FormGroup = this.formHelper.toFormGroup(metadata.schema.items as JsonSchema);
    formArray.insert(count, formGroup);
  }
}
