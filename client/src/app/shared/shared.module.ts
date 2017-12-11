import { NgModule } from '@angular/core';

import { ClipboardDirective } from './clipboard.directive';
import {ClipboardService} from "./clipboard.service";


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
