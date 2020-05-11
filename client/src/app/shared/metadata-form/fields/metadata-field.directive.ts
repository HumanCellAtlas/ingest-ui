import {ComponentFactoryResolver, Directive, Input, OnInit, ViewContainerRef} from '@angular/core';
import {Metadata} from '../metadata';
import {InputComponent} from './input/input.component';
import {AbstractControl} from '@angular/forms';
import {TextListInputComponent} from './text-list-input/text-list-input.component';
import {TextAreaComponent} from './text-area/text-area.component';
import {DateInputComponent} from './date-input/date-input.component';
import {OntologyInputComponent} from './ontology-input/ontology-input.component';

const components = {
  text: InputComponent,
  checkbox: InputComponent,
  number: InputComponent,
  textarea: TextAreaComponent
};


@Directive({
  selector: '[appMetadataField]'
})
export class MetadataFieldDirective implements OnInit {

  @Input() metadata: Metadata;
  @Input() control: AbstractControl;
  @Input() id: string;

  component;

  constructor(private resolver: ComponentFactoryResolver,
              private container: ViewContainerRef) {
  }

  ngOnInit(): void {
    let component;

    if (this.metadata.isScalar()) {

      component = this.metadata.inputType ? components[this.metadata.inputType] : InputComponent;
      component = this.metadata.schema.format === 'date-time' ? DateInputComponent : component;

    } else if (this.metadata.isObject()) {
      component = InputComponent;
      if (this.metadata.schema.$id.indexOf('/module/ontology/') >= 0) {
        component = OntologyInputComponent;
      }

    } else if (this.metadata.isScalarList()) {

      component = TextListInputComponent;

    } else {
      component = InputComponent;
    }

    if (component) {
      this.createAndInitComponent(component);
    }
  }

  private createAndInitComponent(component) {
    const factory = this.resolver.resolveComponentFactory<any>(component);
    this.component = this.container.createComponent(factory);
    this.component.instance.metadata = this.metadata;
    this.component.instance.control = this.control;
    this.component.instance.id = this.id;
  }
}
