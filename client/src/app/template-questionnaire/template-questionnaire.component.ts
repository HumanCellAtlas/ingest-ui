import { Component} from '@angular/core';
import * as questionnaireSchema from './template-questionnaire-schema.json'
import {MetadataFormConfig} from "../metadata-schema-form/models/metadata-form-config";
import {MetadataFormLayout} from "../metadata-schema-form/models/metadata-form-layout";

export const layout: MetadataFormLayout = {
  tabs: [
    {
      title: "Spreadsheet Questionnaire",
      key: "template-questionnaire",
      items: [
        "template-questionnaire",
      ]
    }
  ]
};


@Component({
  selector: 'app-template-questionnaire',
  templateUrl: './template-questionnaire.component.html',
  styleUrls: ['./template-questionnaire.component.css']
})
export class TemplateQuestionnaireComponent {
  templateQuestionnaireSchema: any = (questionnaireSchema as any).default;
  questionnaireData: object= {};
  config: MetadataFormConfig = {
    layout: layout,
    submitButtonLabel: "Generate",
    cancelButtonLabel: "Cancel"
  }

  onSave($event: object) {
    console.log($event)
  }
}
