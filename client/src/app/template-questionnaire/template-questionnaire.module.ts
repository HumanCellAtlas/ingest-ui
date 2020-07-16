import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TemplateQuestionnaireFormComponent} from "./template-questionnaire-form/template-questionnaire-form.component";
import {MetadataSchemaFormModule} from "../metadata-schema-form/metadata-schema-form.module";
import { SpecimenGroupComponent } from './specimen-group/specimen-group.component';


@NgModule({
  declarations: [
    TemplateQuestionnaireFormComponent,
    SpecimenGroupComponent
  ],
  imports: [
    CommonModule,
    MetadataSchemaFormModule
  ]
})
export class TemplateQuestionnaireModule {
}
