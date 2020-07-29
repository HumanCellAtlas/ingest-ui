import { Component, OnInit } from '@angular/core';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';

@Component({
  selector: 'app-specimen-group',
  templateUrl: './donor-group.component.html',
  styleUrls: ['./donor-group.component.css']
})
export class DonorGroupComponent implements OnInit {
  metadataForm: MetadataForm;
  showRelatedDonor = false;

  constructor() { }

  ngOnInit(): void {
    this.onOrganismChange(this.metadataForm.getControl('template-questionnaire.identifyingOrganisms').value);
    this.metadataForm.getControl('template-questionnaire.identifyingOrganisms').valueChanges.subscribe({
      next: data => {
        this.onOrganismChange(data);
      }
    });
  }

  onOrganismChange(identifyingOrganisms: string[]) {
    this.showRelatedDonor = identifyingOrganisms.includes('Human');
    if (!this.showRelatedDonor) {
      this.metadataForm.getControl('template-questionnaire.donorsRelated').reset();
    }
  }
}
