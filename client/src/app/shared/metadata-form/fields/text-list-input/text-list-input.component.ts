import {Component, OnInit} from '@angular/core';
import {Metadata} from '../../metadata';
import {AbstractControl, FormArray} from '@angular/forms';
import {MetadataFormHelper} from '../../metadata-form-helper';

@Component({
  selector: 'app-text-list-input',
  templateUrl: './text-list-input.component.html',
  styleUrls: ['./text-list-input.component.css']
})
export class TextListInputComponent implements OnInit {
  metadata: Metadata;
  control: AbstractControl;
  id: string;

  formHelper: MetadataFormHelper;

  label: string;
  helperText: string;
  error: string;
  disabled: boolean;
  value: string;

  rows: number;


  constructor() {
    this.formHelper = new MetadataFormHelper();
  }

  ngOnInit(): void {
    this.label = this.metadata.schema.user_friendly ? this.metadata.schema.user_friendly : this.metadata.key;
    this.helperText = this.metadata.schema.guidelines;
    this.disabled = this.metadata.isDisabled;
    this.rows = 3;
    this.value = this.control.value.join('\n');
  }

  change($event) {
    const input = $event.target as HTMLInputElement;
    const formArray = this.control as FormArray;
    const value = input.value;

    if (value.trim()) {
      formArray.clear();
      const data = value.split('\n')
      if (data && data.length > 0) {
        for (const elem of data) {
          const val = elem.trim();
          if (val) {
            const elemFormControl = this.formHelper.toFormControl(this.metadata, elem.trim());
            formArray.push(elemFormControl);
          }
        }
      }
    } else {
      formArray.clear();
    }
  }
}
