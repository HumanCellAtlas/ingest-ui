import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild} from '@angular/core';
import {InputComponent} from '../metadata-field-types/input/input.component';
import {DateInputComponent} from '../metadata-field-types/date-input/date-input.component';
import {OntologyInputComponent} from '../metadata-field-types/ontology-input/ontology-input.component';
import {TextListInputComponent} from '../metadata-field-types/text-list-input/text-list-input.component';
import {Metadata} from '../models/metadata';
import {TextAreaComponent} from '../metadata-field-types/text-area/text-area.component';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MetadataFormItemDirective} from '../metadata-form-item.directive';
import {JsonSchema} from '../models/json-schema';
import {OntologyListInputComponent} from '../metadata-field-types/ontology-list-input/ontology-list-input.component';
import {EnumListInputComponent} from '../metadata-field-types/enum-list-input/enum-list-input.component';
import {EnumRadioListComponent} from '../metadata-field-types/enum-radio-list/enum-radio-list.component';
import {EnumRadioInlineComponent} from '../metadata-field-types/enum-radio-inline/enum-radio-inline.component';
import {EnumDropDownComponent} from '../metadata-field-types/enum-drop-down/enum-drop-down.component';

const components = {
  text: InputComponent,
  checkbox: InputComponent,
  number: InputComponent,
  textarea: TextAreaComponent
};
const enumComponents = {
  text: EnumDropDownComponent,
  radio: EnumRadioListComponent,
  radioInline: EnumRadioInlineComponent,
  dropdown: EnumDropDownComponent
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

  @Input()
  id: string;

  @ViewChild(MetadataFormItemDirective, {static: true}) fieldHost: MetadataFormItemDirective;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.loadComponent(this.metadata, this.control, this.id);
  }

  private loadComponent(metadata: Metadata, control: AbstractControl, id: string) {
    const component = this.selectComponent(metadata, control, id);

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

  private selectComponent(metadata: Metadata, control: AbstractControl, id: string) {
    let component;
    let hasValue: boolean;

    if (!control) {
      return undefined;
    }

    if (metadata.isScalar()) {
      if (metadata.schema.enum) {
        component = metadata.inputType && enumComponents[metadata.inputType] ? enumComponents[metadata.inputType] : EnumRadioInlineComponent;
      } else {
        component = metadata.inputType && components[metadata.inputType] ? components[metadata.inputType] : InputComponent;
        component = metadata.schema.format === 'date-time' ? DateInputComponent : component;
      }
      hasValue = control.value;
    } else if (metadata.isScalarList()) {
      if (metadata.schema.enum) {
        component = EnumListInputComponent;
      } else {
        component = TextListInputComponent;
      }
      hasValue = control.value?.length > 0;
    } else if (metadata.isObject()) {
      if (metadata.schema && metadata.schema.$id && metadata.schema.$id.indexOf('/module/ontology/') >= 0) {
        component = OntologyInputComponent;
      } else {
        component = InputComponent;
      }

      hasValue = control ? Object.keys(control.value).length > 0 : false;

    } else { // object list
      const schema = metadata.schema.items as JsonSchema;
      if (schema.$id.indexOf('/module/ontology/') >= 0) {
        component = OntologyListInputComponent;
      } else {
        component = InputComponent;
      }
      hasValue = control.value;
    }
    if (metadata.isDisabled && metadata.isReadOnly && !hasValue) {
      return undefined;
    }
    return component;
  }
}
