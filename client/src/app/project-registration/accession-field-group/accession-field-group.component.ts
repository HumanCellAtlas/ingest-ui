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
  isAccessioned: boolean | undefined;
  control: FormControl;
  accessionId: string;

  constructor() {
  }

  ngOnInit(): void {
  }


  onIsAccessionedChange(isAccessioned: boolean) {
    this.isAccessioned = isAccessioned;
  }


  onProjectAccessionIdChange(accessionId: string) {
    // TODO set specific accession field
    // Should we display an error if accession couldn't be set? It won't be stored if accession field cannot be determined
  }
}
