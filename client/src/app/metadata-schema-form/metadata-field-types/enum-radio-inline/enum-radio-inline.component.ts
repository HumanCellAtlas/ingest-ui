import {Component, OnInit} from '@angular/core';
import {MetadataFormHelper} from '../../models/metadata-form-helper';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
  selector: 'app-enum-radio-inline',
  templateUrl: './enum-radio-inline.component.html',
  styleUrls: ['./enum-radio-inline.component.css']
})
export class EnumRadioInlineComponent extends BaseInputComponent implements OnInit {
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
