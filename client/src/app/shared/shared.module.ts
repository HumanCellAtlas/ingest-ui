import {NgModule} from '@angular/core';

import {ClipboardDirective} from './directives/clipboard.directive';
import {ClipboardService} from './services/clipboard.service';
import {SubmissionStateComponent} from './components/submission-state/submission-state.component';
import {CommonModule} from '@angular/common';
import {MetadataStateComponent} from './components/metadata-state/metadata-state.component';
import {MatChipsModule} from '@angular/material/chips';


@NgModule({
  imports: [
    CommonModule,
    MatChipsModule
  ],
  declarations: [
    ClipboardDirective,
    SubmissionStateComponent,
    MetadataStateComponent,
  ],
  exports: [
    ClipboardDirective,
    SubmissionStateComponent,
    MetadataStateComponent
  ],
  providers: [
    ClipboardService
  ],
})
export class SharedModule {
}
