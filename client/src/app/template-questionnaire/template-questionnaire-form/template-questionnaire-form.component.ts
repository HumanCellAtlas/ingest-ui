import { Component} from '@angular/core';
import * as questionnaireSchema from './template-questionnaire-schema.json'
import {MetadataFormConfig} from "../../metadata-schema-form/models/metadata-form-config";
import {MetadataFormLayout} from "../../metadata-schema-form/models/metadata-form-layout";
import {SpecimenGroupComponent} from "../specimen-group/specimen-group.component";

export const layout: MetadataFormLayout = {
  tabs: [
    {
      title: "Spreadsheet Questionnaire",
      key: "template-questionnaire",
      items: [
        "template-questionnaire.identifyingOrganisms",
        "template-questionnaire.preNatalQuantity",
        "template-questionnaire.donorsRelated",
        {
          keys: [
            'template-questionnaire.specimenType',
            'template-questionnaire.specimenPurchased'
          ],
          component: SpecimenGroupComponent
        },
        "template-questionnaire.technology.ontologies",
        "template-questionnaire.experimentInfo",
        "template-questionnaire.experimentTimecourse"
      ]
    }
  ]
};


@Component({
  selector: 'app-template-questionnaire',
  templateUrl: './template-questionnaire-form.component.html',
  styleUrls: ['./template-questionnaire-form.component.css']
})
export class TemplateQuestionnaireFormComponent {
  templateQuestionnaireSchema: any = (questionnaireSchema as any).default;
  questionnaireData: object = {
    "identifyingOrganisms": ["Human"],
    "specimenType": ["Primary Tissue"]
  };
  config: MetadataFormConfig = {
    layout: layout,
    submitButtonLabel: "Generate",
    cancelButtonLabel: "Cancel"
  }

  onSave($event: object) {
    console.log($event)
  }
}
