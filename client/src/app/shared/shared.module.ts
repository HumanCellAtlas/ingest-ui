import {NgModule} from '@angular/core';

import {ClipboardDirective} from './directives/clipboard.directive';
import {ClipboardService} from './services/clipboard.service';
import {SubmissionStateComponent} from './components/submission-state/submission-state.component';
import {CommonModule} from '@angular/common';
import {MetadataStateComponent} from './components/metadata-state/metadata-state.component';
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
    MatAutocompleteModule,
    MatListModule,
    MatToolbarModule
  ],
  declarations: [
    ClipboardDirective,
    SubmissionStateComponent,
    MetadataStateComponent
  ],
  exports: [
    ClipboardDirective,
    SubmissionStateComponent,
    MetadataStateComponent
  ],
  providers: [
    ClipboardService
  ]
})
export class SharedModule {
}
