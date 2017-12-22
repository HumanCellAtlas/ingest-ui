import { NgModule } from '@angular/core';

import { ClipboardDirective } from './directives/clipboard.directive';
import {ClipboardService} from "./services/clipboard.service";


@NgModule({
  declarations: [
    ClipboardDirective
  ],
  exports: [
    ClipboardDirective
  ],
  providers: [
    ClipboardService
  ],
})
export class SharedModule{}
