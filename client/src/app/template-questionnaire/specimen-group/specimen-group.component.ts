import { Component, OnInit } from '@angular/core';
import {MetadataForm} from "../../metadata-schema-form/models/metadata-form";

@Component({
  selector: 'app-specimen-group',
  templateUrl: './specimen-group.component.html',
  styleUrls: ['./specimen-group.component.css']
})
export class SpecimenGroupComponent implements OnInit {
  metadataForm: MetadataForm;
  showPurchased: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.metadataForm.getControl('template-questionnaire.specimenType').valueChanges.subscribe({
      next: data => {
        this.onTypeChange(data)
      }
    })
  }

  onTypeChange(specimenType: string[]) {
    this.showPurchased = specimenType.includes("Organoid") || specimenType.includes("Cell Line")
    if (!this.showPurchased) {
      this.metadataForm.getControl('template-questionnaire.specimenPurchased').reset()
    }
  }
}
