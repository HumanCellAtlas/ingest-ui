import {Component, OnInit} from '@angular/core';
import {Metadata} from '../../models/metadata';
import {AbstractControl, FormControl} from '@angular/forms';
import {FormItemData} from "../../form-item/form-item.component";

@Component({
  selector: 'app-base-input',
  template: '',
  styles: []
})
export class BaseInputComponent implements OnInit {
  metadata: Metadata;
  control: AbstractControl;
  id: string;

  //TODO consolidate form item data
  label: string;
  helperText: string;
  isRequired: boolean;
  disabled: boolean;

  data: FormItemData;

  error: string;
  placeholder: string;

  constructor() {
  }

  ngOnInit(): void {
    const userFriendly = this.metadata.schema.user_friendly;
    const title = this.metadata.schema.title;


    const guidelines = this.metadata.schema.guidelines;
    const description = this.metadata.schema.description;

    //TODO consolidate form item data
    this.label = userFriendly ? userFriendly : title ? title : this.metadata.key;
    this.helperText = guidelines ? guidelines : description;
    this.isRequired = this.metadata.isRequired;
    this.disabled = this.metadata.isDisabled || this.metadata.isDisabled;
    this.data = <FormItemData> {
      label: this.label,
      helperText: this.helperText,
      isRequired: this.isRequired,
      disabled: this.disabled
    }

    this.placeholder = this.metadata.schema.example;
  }

  checkForErrors(control: AbstractControl): string {
    control = control as FormControl;

    if ((control.touched || control.dirty) && control.invalid && (control.errors && control.errors.required)) {
      return 'This field is required';
    }

    const parent = control.parent;
    if (parent && (parent.touched || control.touched) && parent.invalid && parent.errors && parent.errors.required) {
      return 'This field is required';
    }
  }
}
