import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray} from '@angular/forms';
import {MetadataFormHelper} from '../../models/metadata-form-helper';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
  selector: 'app-text-list-input',
  templateUrl: './text-list-input.component.html',
  styleUrls: ['./text-list-input.component.css', '../../form-item/form-item.component.css']
})
export class TextListInputComponent extends BaseInputComponent implements OnInit {
  formHelper: MetadataFormHelper;
  value: string;
  rows: number;

  constructor() {
    super();
    this.formHelper = new MetadataFormHelper();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.rows = 3;
    this.value = this.control.value.join('\n');
  }

  change($event) {
    this.control.markAsTouched();
    const input = $event.target as HTMLInputElement;
    const formArray = this.control as FormArray;
    const value = input.value;

    if (value.trim()) {
      formArray.clear();
      const data = value.split('\n');
      if (data && data.length > 0) {
        for (const elem of data) {
          const val = elem.trim();
          if (val) {
            let elemFormControl;
            if (this.metadata.schema.items['type'] === 'integer') {
              elemFormControl = this.formHelper.toFormControl(this.metadata, parseInt(val, 10));
            } else {
              elemFormControl = this.formHelper.toFormControl(this.metadata, val);
            }

            formArray.push(elemFormControl);
          }
        }
      }
    } else {
      formArray.clear();
    }
  }

  onBlur() {
    this.control.markAllAsTouched();
  }

  shouldSetRequiredAttr(): boolean {
    return (this.isControlRequired(this.control) || this.isControlRequired(this.control.parent)) && this.control.touched;
  }

  private isControlRequired(control: AbstractControl): boolean {
    return control && control.invalid && control.errors && control.errors.required;
  }
}
