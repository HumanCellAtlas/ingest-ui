import { Component} from '@angular/core';
import * as questionnaireSchema from './template-questionnaire-schema.json'
import {MetadataFormConfig} from "../../metadata-schema-form/models/metadata-form-config";
import {MetadataFormLayout} from "../../metadata-schema-form/models/metadata-form-layout";
import {SpecimenGroupComponent} from "../specimen-group/specimen-group.component";
import {DonorGroupComponent} from "../donor-group/donor-group.component";
import {TechnologyGroupComponent} from "../technology-group/technology-group.component";

export const layout: MetadataFormLayout = {
  tabs: [
    {
      title: "Spreadsheet Questionnaire",
      key: "template-questionnaire",
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
        "template-questionnaire.experimentInfo",
        "template-questionnaire.protocols"
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
    "technologyType": ["Sequencing"],
    "libraryPreparation": ["Droplet-based (e.g. 10X chromium, dropSeq, InDrop)"],
    "identifyingOrganisms": ["Human"],
    "specimenType": ["Primary Tissue"]
  };
  config: MetadataFormConfig = {
    layout: layout,
    submitButtonLabel: "Generate Spreadsheet",
    cancelButtonLabel: "Cancel"
  }
  title: string = this.templateQuestionnaireSchema.title;

  onSave($event: object) {
    console.log($event)
    this.download('assets/xlsx-templates/Empty_template_v4.6.1_spreadsheet_NOPROJECTTAB.xlsx');
  }

  private download(url: string) {
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = url;
    link.download = 'template.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

}
