import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatChipsModule} from '@angular/material/chips';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {RouterModule} from '@angular/router';
import {MetadataFormComponent} from './metadata-form/metadata-form.component';
import {InputComponent} from './metadata-field-types/input/input.component';
import {VfInputComponent} from './field-types/vf-input/vf-input.component';
import {MetadataFormItemDirective} from './metadata-form-item.directive';
import {TextListInputComponent} from './metadata-field-types/text-list-input/text-list-input.component';
import {TextAreaComponent} from './metadata-field-types/text-area/text-area.component';
import {VfAsteriskComponent} from './field-types/vf-asterisk/vf-asterisk.component';
import {DateInputComponent} from './metadata-field-types/date-input/date-input.component';
import {OntologyInputComponent} from './metadata-field-types/ontology-input/ontology-input.component';
import {MultipleSelectComponent} from './field-types/multiple-select/multiple-select.component';
import {MetadataFieldComponent} from './metadata-field/metadata-field.component';
import {SelectComponent} from './field-types/select/select.component';
import {OntologyListInputComponent} from './metadata-field-types/ontology-list-input/ontology-list-input.component';
import {EnumListInputComponent} from './metadata-field-types/enum-list-input/enum-list-input.component';
import {MaterialModule} from '../material.module';
import {OntologyBaseComponent} from './metadata-field-types/ontology-base/ontology-base.component';
import { MetadataFormItemComponent } from './metadata-form-item/metadata-form-item.component';


@NgModule({
  imports: [
    CommonModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatTabsModule,
    FormsModule,
    RouterModule,
    MaterialModule
  ],
  declarations: [
    MetadataFormComponent,
    InputComponent,
    VfInputComponent,
    MetadataFormItemDirective,
    TextListInputComponent,
    TextAreaComponent,
    VfAsteriskComponent,
    DateInputComponent,
    OntologyInputComponent,
    MultipleSelectComponent,
    MetadataFieldComponent,
    SelectComponent,
    OntologyListInputComponent,
    EnumListInputComponent,
    OntologyBaseComponent,
    MetadataFormItemComponent
  ],
  exports: [
    MetadataFormComponent
  ],
  providers: []
})
export class MetadataSchemaFormModule {
}
