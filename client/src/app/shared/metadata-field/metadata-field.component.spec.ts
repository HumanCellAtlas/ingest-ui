import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataFieldComponent } from './metadata-field.component';
import {Metadata} from '../metadata-form/metadata';
import {JsonSchemaProperty} from '../metadata-form/json-schema-property';

describe('MetadataFieldComponent', () => {
  let component: MetadataFieldComponent;
  let fixture: ComponentFixture<MetadataFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadataFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataFieldComponent);
    component = fixture.componentInstance;
    component.metadata = new Metadata({
      children: [],
      isDisabled: false,
      isHidden: false,
      isRequired: false,
      key: '',
      parent: '',
      schema: {} as JsonSchemaProperty
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
