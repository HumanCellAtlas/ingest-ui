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
    this.onTimecourseChange(this.metadataForm.getControl('template-questionnaire.experimentInfo').value);
    this.metadataForm.getControl('template-questionnaire.experimentInfo').valueChanges.subscribe({
      next: data => {
        this.onTimecourseChange(data);
      }
    });
  }

  onTimecourseChange(otherExperimentInfo: string) {
    this.showTimecourseBiomaterialType = otherExperimentInfo.includes('Timecourse');
    if (!this.showTimecourseBiomaterialType) {
      this.metadataForm.getControl('template-questionnaire.timecourseBiomaterialType').reset();
    }
  }
}
