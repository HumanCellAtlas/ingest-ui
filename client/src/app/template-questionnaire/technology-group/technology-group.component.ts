import { Component, OnInit } from '@angular/core';
import {MetadataForm} from "../../metadata-schema-form/models/metadata-form";

@Component({
  selector: 'app-specimen-group',
  templateUrl: './technology-group.component.html',
  styleUrls: ['./technology-group.component.css']
})
export class TechnologyGroupComponent implements OnInit {
  metadataForm: MetadataForm;
  showLibraryPrep: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.onTypeChange(this.metadataForm.getControl('template-questionnaire.technologyType').value);
    this.metadataForm.getControl('template-questionnaire.technologyType').valueChanges.subscribe({
      next: data => {
        this.onTypeChange(data);
      }
    })
  }

  onTypeChange(technologyType: string[]) {
    this.showLibraryPrep = technologyType.includes("Sequencing");
    if (!this.showLibraryPrep) {
      this.metadataForm.getControl('template-questionnaire.libraryPreparation').reset();
    }
  }
}
