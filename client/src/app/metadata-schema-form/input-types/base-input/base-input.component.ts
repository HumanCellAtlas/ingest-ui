import { Component, OnInit } from '@angular/core';
import {Metadata} from '../../models/metadata';
import {AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-base-input',
  template: '',
  styles: []
})
export class BaseInputComponent implements OnInit {
  metadata: Metadata;
  control: AbstractControl;
  id: string;

  label: string;
  helperText: string;
  isRequired: boolean;
  error: string;
  placeholder: string;
  disabled: boolean;
  constructor() { }

  ngOnInit(): void {
    const userFriendly = this.metadata.schema.user_friendly;
    const title = this.metadata.schema.title;
    this.label = userFriendly ? userFriendly : title ? title : this.metadata.key;

    const guidelines = this.metadata.schema.guidelines;
    const description = this.metadata.schema.description;
    this.helperText = guidelines ? guidelines : description;

    this.isRequired = this.metadata.isRequired;

    this.disabled = this.metadata.isDisabled || this.metadata.isDisabled;

    this.placeholder = this.metadata.schema.example;
  }

}
