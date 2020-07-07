import {Directive, ViewContainerRef} from '@angular/core';


@Directive({
  selector: '[appMetadataFormItem]'
})
export class MetadataFormItemDirective {

  constructor(public container: ViewContainerRef) {
  }

}
