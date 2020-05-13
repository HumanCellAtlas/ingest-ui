import {NgModule} from '@angular/core';

import {ClipboardDirective} from './directives/clipboard.directive';
import {ClipboardService} from './services/clipboard.service';
import {SubmissionStateComponent} from './components/submission-state/submission-state.component';
import {CommonModule} from '@angular/common';
import {MetadataStateComponent} from './components/metadata-state/metadata-state.component';
import {MatChipsModule} from '@angular/material/chips';
import {MetadataFormComponent} from './metadata-form/metadata-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {VfInputComponent} from './metadata-form/fields/vf-input/vf-input.component';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MetadataFieldDirective} from './metadata-form/fields/metadata-field.directive';
import {InputComponent} from './metadata-form/fields/input/input.component';
import { TextListInputComponent } from './metadata-form/fields/text-list-input/text-list-input.component';
import { TextAreaComponent } from './metadata-form/fields/text-area/text-area.component';
import { VfAsteriskComponent } from './metadata-form/fields/vf-asterisk/vf-asterisk.component';
import { DateInputComponent } from './metadata-form/fields/date-input/date-input.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { OntologyInputComponent } from './metadata-form/fields/ontology-input/ontology-input.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";


@NgModule({
  imports: [
    CommonModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatTabsModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  declarations: [
    ClipboardDirective,
    SubmissionStateComponent,
    MetadataStateComponent,
    MetadataFormComponent,
    InputComponent,
    VfInputComponent,
    MetadataFieldDirective,
    TextListInputComponent,
    TextAreaComponent,
    VfAsteriskComponent,
    DateInputComponent,
    OntologyInputComponent,
  ],
  exports: [
    ClipboardDirective,
    SubmissionStateComponent,
    MetadataStateComponent,
    MetadataFormComponent
  ],
  providers: [
    ClipboardService
  ],
  entryComponents: [
    InputComponent,
    TextListInputComponent
  ]
})
export class SharedModule {
}
