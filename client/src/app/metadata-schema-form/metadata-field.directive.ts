import {Directive, ViewContainerRef} from '@angular/core';


@Directive({
  selector: '[appMetadataField]'
})
export class MetadataFieldDirective {

  constructor(public container: ViewContainerRef) {
  }

}
