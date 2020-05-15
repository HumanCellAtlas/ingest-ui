import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild} from '@angular/core';
import {InputComponent} from '../fields/input/input.component';
import {DateInputComponent} from '../fields/date-input/date-input.component';
import {OntologyInputComponent} from '../fields/ontology-input/ontology-input.component';
import {TextListInputComponent} from '../fields/text-list-input/text-list-input.component';
import {Metadata} from '../metadata';
import {TextAreaComponent} from '../fields/text-area/text-area.component';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MetadataFieldDirective} from '../metadata-field.directive';
import {MultipleSelectComponent} from "../fields/multiple-select/multiple-select.component";
import {JsonSchema} from "../json-schema";

const components = {
  text: InputComponent,
  checkbox: InputComponent,
  number: InputComponent,
  textarea: TextAreaComponent
};


@Component({
  selector: 'app-metadata-field',
  templateUrl: './metadata-field.component.html',
  styleUrls: ['./metadata-field.component.css']
})
export class MetadataFieldComponent implements OnInit {
  @Input()
  metadata: Metadata;

  @Input()
  control: AbstractControl;

  @ViewChild(MetadataFieldDirective, {static: true}) fieldHost: MetadataFieldDirective;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.loadComponent(this.metadata, this.control, this.metadata.key);
  }

  private loadComponent(metadata: Metadata, control: AbstractControl, id: string) {
    let component;

    if (metadata.isScalar()) {

      component = metadata.inputType ? components[metadata.inputType] : InputComponent;
      component = metadata.schema.format === 'date-time' ? DateInputComponent : component;

    } else if (metadata.isScalarList()) {
      if (metadata.schema.enum) {
        component = MultipleSelectComponent;
      } else {
        component = TextListInputComponent;
      }
    } else if (metadata.isObject()) {

      if (metadata.schema.$id.indexOf('/module/ontology/') >= 0) {
        component = OntologyInputComponent;
      } else {
        component = InputComponent;
        const formGroup = control as FormGroup;
        for (const child of metadata.childrenMetadata) {
          this.loadComponent(child, formGroup['controls'][child.key], `${id}'-'${child.key}`);
        }
      }

    } else { // object list
      const schema = metadata.schema.items as JsonSchema;
      if (schema.$id.indexOf('/module/ontology/') >= 0) {
        component = MultipleSelectComponent;
      } else {
        component = InputComponent;
      }
    }

    if (component) {
      const factory = this.resolver.resolveComponentFactory<any>(component);
      const container = this.fieldHost.container;
      container.clear();
      const newComponent = container.createComponent(factory);
      newComponent.instance.metadata = metadata;
      newComponent.instance.control = control;
      newComponent.instance.id = id;
    }
  }
}
