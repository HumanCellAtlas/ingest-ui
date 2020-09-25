import { Component, OnInit } from '@angular/core';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';

@Component({
  selector: 'app-specimen-group',
  templateUrl: './experiment-detail-group.component.html',
  styleUrls: ['./experiment-detail-group.component.css']
})
export class ExperimentDetailGroupComponent implements OnInit {
  metadataForm: MetadataForm;
  showTimecourseBiomaterialType = false;

  constructor() { }

  ngOnInit(): void {
    this.onTimecourseChange(this.metadataForm.getControl('template-questionnaire.timecourse').value);
    this.metadataForm.getControl('template-questionnaire.timecourse').valueChanges.subscribe({
      next: data => {
        this.onTimecourseChange(data);
      }
    });
  }

  onTimecourseChange(timecourse: string) {
    this.showTimecourseBiomaterialType = timecourse === 'Yes';
    if (!this.showTimecourseBiomaterialType) {
      this.metadataForm.getControl('template-questionnaire.timecourseBiomaterialType').reset();
    }
  }
}
