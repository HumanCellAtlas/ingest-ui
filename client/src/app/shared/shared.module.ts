import {NgModule} from '@angular/core';

import {ClipboardDirective} from './directives/clipboard.directive';
import {ClipboardService} from './services/clipboard.service';
import {SubmissionStateComponent} from './components/submission-state/submission-state.component';
import {CommonModule} from '@angular/common';
import {MetadataStateComponent} from './components/metadata-state/metadata-state.component';
import {MatChipsModule} from '@angular/material/chips';
import { MetadataFormComponent } from './metadata-form/metadata-form.component';
import { MetadataFieldComponent } from './metadata-field/metadata-field.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from "@angular/material/tabs";
import { VfInputComponent } from './vf-input/vf-input.component';
import {RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  imports: [
    CommonModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatTabsModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [
    ClipboardDirective,
    SubmissionStateComponent,
    MetadataStateComponent,
    MetadataFormComponent,
    MetadataFieldComponent,
    VfInputComponent,
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
