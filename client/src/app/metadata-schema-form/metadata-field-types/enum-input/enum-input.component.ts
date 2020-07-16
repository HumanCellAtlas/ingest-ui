import {Component, OnInit} from '@angular/core';
import {MetadataFormHelper} from '../../models/metadata-form-helper';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
  selector: 'app-enum-input',
  templateUrl: './enum-input.component.html',
  styleUrls: ['./enum-input.component.css']
})
export class EnumInputComponent extends BaseInputComponent implements OnInit {
  formHelper: MetadataFormHelper;

  constructor() {
    super();
    this.formHelper = new MetadataFormHelper();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  updateControl(value: string) {
    this.control.markAllAsTouched();
    if (!value) {
      this.control.reset();
    } else {
      this.control.setValue(value);
    }
  }
}
