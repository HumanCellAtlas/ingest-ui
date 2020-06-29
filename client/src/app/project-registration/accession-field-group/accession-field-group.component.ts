import {Component, OnInit} from '@angular/core';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';

@Component({
  selector: 'app-accession-field-group',
  templateUrl: './accession-field-group.component.html',
  styleUrls: ['./accession-field-group.component.css']
})
export class AccessionFieldGroupComponent implements OnInit {
  metadataForm: MetadataForm;

  constructor() {
  }

  ngOnInit(): void {
    console.log('metadataForm', this.metadataForm);
  }

}
