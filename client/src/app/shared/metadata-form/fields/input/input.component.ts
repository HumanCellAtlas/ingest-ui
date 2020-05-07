import {Component, OnInit} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {Metadata} from '../../metadata';
import {MetadataFormHelper} from '../../metadata-form-helper';

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
}
