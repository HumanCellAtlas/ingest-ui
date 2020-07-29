import {Component, OnInit} from '@angular/core';
import * as questionnaireSchema from './template-questionnaire-schema.json';
import {MetadataFormConfig} from '../../metadata-schema-form/models/metadata-form-config';
import {MetadataFormLayout} from '../../metadata-schema-form/models/metadata-form-layout';
import {SpecimenGroupComponent} from '../specimen-group/specimen-group.component';
import {DonorGroupComponent} from '../donor-group/donor-group.component';
import {TechnologyGroupComponent} from '../technology-group/technology-group.component';
import {QuestionnaireData} from '../template-questionnaire.data';
import {TemplateGeneratorService} from '../template-generator.service';
import {saveAs} from 'file-saver';
import {Router} from '@angular/router';

export const layout: MetadataFormLayout = {
  tabs: [
    {
      title: 'Spreadsheet Questionnaire',
      key: 'template-questionnaire',
      items: [
        {
          component: TechnologyGroupComponent
        },
        {
          component: DonorGroupComponent
        },
        {
          component: SpecimenGroupComponent
        },
        'template-questionnaire.experimentInfo',
        'template-questionnaire.protocols'
      ]
    }
  ]
};

@Component({
  selector: 'app-template-questionnaire',
  templateUrl: './template-questionnaire-form.component.html',
  styleUrls: ['./template-questionnaire-form.component.css']
})
export class TemplateQuestionnaireFormComponent implements OnInit {
  templateQuestionnaireSchema: any = (questionnaireSchema as any).default;
  questionnaireData: object = {
    'technologyType': ['Sequencing'],
    'libraryPreparation': ['Droplet-based (e.g. 10X chromium, dropSeq, InDrop)'],
    'identifyingOrganisms': ['Human'],
    'specimenType': ['Primary Tissue']
  };
  config: MetadataFormConfig = {
    layout: layout,
    submitButtonLabel: 'Generate Spreadsheet',
    cancelButtonLabel: 'Cancel',
    showResetButton: true
  };

  constructor(private templateGenerator: TemplateGeneratorService, private router: Router) {

  }

  ngOnInit(): void {
  }

  onSave($event: object) {
    const data: QuestionnaireData = $event['value'];
    console.log(data.specimenType);
    this.templateGenerator.generate(data).then(blob => {
      saveAs(blob, 'template.xlsx');
    });
    console.log($event);
  }

  onCancel($event) {
    if ($event) {
      this.router.navigate(['/projects']);
    }
  }

  onReset($event: boolean) {
    window.location.reload();
  }
}
