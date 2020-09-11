import { Component, OnInit } from '@angular/core';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';

@Component({
  selector: 'app-specimen-group',
  templateUrl: './specimen-group.component.html',
  styleUrls: ['./specimen-group.component.css']
})
export class SpecimenGroupComponent implements OnInit {
  metadataForm: MetadataForm;
  showPurchased = false;

  constructor() { }

  ngOnInit(): void {
    this.onTypeChange(this.metadataForm.getControl('template-questionnaire.specimenType').value);
    this.metadataForm.getControl('template-questionnaire.specimenType').valueChanges.subscribe({
      next: data => {
        this.onTypeChange(data);
      }
    });
  }

  onTypeChange(specimenType: string[]) {
    this.showPurchased = specimenType.includes('Cell Line');
    if (!this.showPurchased) {
      this.metadataForm.getControl('template-questionnaire.specimenPurchased').reset();
    }
  }
}
