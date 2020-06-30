import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccessionFieldGroupComponent} from './accession-field-group/accession-field-group.component';
import {ProjectRegistrationSummaryComponent} from './project-registration-summary/project-registration-summary.component';
import {ProjectRegistrationFormComponent} from './project-registration-form/project-registration-form.component';
import {PublicationFieldGroupComponent} from './publication-field-group/publication-field-group.component';
import { ContactFieldGroupComponent } from './contact-field-group/contact-field-group.component';
import {MetadataSchemaFormModule} from '../metadata-schema-form/metadata-schema-form.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    AccessionFieldGroupComponent,
    ProjectRegistrationSummaryComponent,
    ProjectRegistrationFormComponent,
    PublicationFieldGroupComponent,
    ContactFieldGroupComponent
  ],
  imports: [
    CommonModule,
    MetadataSchemaFormModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProjectRegistrationModule {
}
