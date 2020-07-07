import {Component, ComponentFactoryResolver, Input, OnInit, Type, ViewChild} from '@angular/core';
import {MetadataForm} from '../models/metadata-form';
import {MetadataFieldGroup} from '../models/metadata-form-layout';
import {MetadataFormItemDirective} from '../metadata-form-item.directive';
import {MetadataFieldComponent} from '../metadata-field/metadata-field.component';

@Component({
  selector: 'app-metadata-form-item',
  templateUrl: './metadata-form-item.component.html',
  styleUrls: ['./metadata-form-item.component.css']
})
export class MetadataFormItemComponent implements OnInit {
  @Input()
  item: string | MetadataFieldGroup;

  @Input()
  metadataForm: MetadataForm;

  @ViewChild(MetadataFormItemDirective, {static: true}) itemHost: MetadataFormItemDirective;

  component: Type<any>;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    if (typeof this.item === 'string') {
      const newComponent = this.loadComponent(MetadataFieldComponent);
      newComponent.instance.metadata = this.metadataForm.get(this.item);
      newComponent.instance.control = this.metadataForm.getControl(this.item);
      newComponent.instance.id = this.item;
    } else {
      // TODO create a base component for field and for field group
      this.component = this.item.component;
      const newComponent = this.loadComponent(this.component);
      newComponent.instance.metadataForm = this.metadataForm;
    }
  }

  loadComponent(component) {
    if (component) {
      const factory = this.resolver.resolveComponentFactory<any>(component);
      const container = this.itemHost.container;
      container.clear();
      return  container.createComponent(factory);
    }
  }
}
