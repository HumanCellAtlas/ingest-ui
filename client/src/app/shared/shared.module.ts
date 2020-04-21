import {NgModule} from '@angular/core';

import {ClipboardDirective} from './directives/clipboard.directive';
import {ClipboardService} from './services/clipboard.service';
import {SubmissionStateComponent} from './components/submission-state/submission-state.component';
import {CommonModule} from '@angular/common';
import {MetadataStateComponent} from './components/metadata-state/metadata-state.component';
import {MatChipsModule} from '@angular/material/chips';
import { MetadataFormComponent } from './metadata-form/metadata-form.component';
import { MetadataFieldComponent } from './metadata-field/metadata-field.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    MatChipsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ClipboardDirective,
    SubmissionStateComponent,
    MetadataStateComponent,
    MetadataFormComponent,
    MetadataFieldComponent,
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
})
export class SharedModule {
}
