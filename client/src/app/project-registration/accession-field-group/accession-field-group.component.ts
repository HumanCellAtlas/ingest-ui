import {Component, OnInit} from '@angular/core';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-accession-field-group',
  templateUrl: './accession-field-group.component.html',
  styleUrls: ['./accession-field-group.component.css']
})
export class AccessionFieldGroupComponent implements OnInit {
  metadataForm: MetadataForm;
  label: string;
  isAccessioned = false;
  control: FormControl;

  constructor() {
  }

  ngOnInit(): void {
    console.log('metadataForm', this.metadataForm);
  }


  onChange(isAccessioned: boolean) {
    this.isAccessioned = isAccessioned;
    console.log('isAccessioned', this.isAccessioned);
  }


}
