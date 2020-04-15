import {NgModule} from '@angular/core';

import {ClipboardDirective} from './directives/clipboard.directive';
import {ClipboardService} from './services/clipboard.service';
import {StateChipComponent} from './components/state-chip/state-chip.component';
import {MatChipsModule} from '@angular/material';
import {CommonModule} from '@angular/common';


@NgModule({
  imports : [
    CommonModule,
    MatChipsModule
  ],
  declarations: [
    ClipboardDirective,
    StateChipComponent,
  ],
  exports: [
    ClipboardDirective,
    StateChipComponent
  ],
  providers: [
    ClipboardService
  ],
})
export class SharedModule {}
