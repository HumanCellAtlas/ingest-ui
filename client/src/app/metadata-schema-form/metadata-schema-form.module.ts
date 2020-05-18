import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatChipsModule} from '@angular/material/chips';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MetadataFormComponent} from './metadata-form/metadata-form.component';
import {InputComponent} from './metadata-field-types/input/input.component';
import {VfInputComponent} from './field-types/vf-input/vf-input.component';
import {MetadataFieldDirective} from './metadata-field.directive';
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
    MetadataFieldDirective,
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
  ],
  exports: [
    MetadataFormComponent
  ],
  providers: []
})
export class MetadataSchemaFormModule {
}
