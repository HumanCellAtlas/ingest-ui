import {ComponentFactoryResolver, Directive, Input, OnInit, ViewContainerRef} from '@angular/core';
import {Metadata} from '../metadata-form/metadata';
import {MetadataFieldComponent} from './metadata-field.component';
import {AbstractControl} from '@angular/forms';

const components = {
  input: MetadataFieldComponent,
};

@Directive({
  selector: '[appMetadataField]'
})
export class MetadataFieldDirective implements OnInit {

  @Input() metadata: Metadata;
  @Input() control: AbstractControl;

  component;

  constructor(private resolver: ComponentFactoryResolver,
              private container: ViewContainerRef) {
  }

  ngOnInit(): void {
    if (this.metadata.isScalar() || this.metadata.isScalarList() || this.metadata.isObject()) {
      const component = MetadataFieldComponent;
      const factory = this.resolver.resolveComponentFactory<any>(component);
      this.component = this.container.createComponent(factory);
      this.component.instance.metadata = this.metadata;
      this.component.instance.control = this.control;
    }
  }

}
