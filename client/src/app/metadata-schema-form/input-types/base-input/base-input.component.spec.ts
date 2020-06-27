import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseInputComponent } from './base-input.component';
import {JsonSchemaProperty} from '../../models/json-schema-property';
import {Metadata} from '../../models/metadata';

describe('BaseInputComponent', () => {
  let component: BaseInputComponent;
  let fixture: ComponentFixture<BaseInputComponent>;
  let metadata: Metadata;
  let schema: JsonSchemaProperty;

  beforeEach(async(() => {
    schema = {
      $id: '',
      $schema: '',
      description: 'Name of individual who has contributed to the project.',
      type: 'string',
      example: 'John,D,Doe; Jane,,Smith',
      guidelines: 'Enter in the format: first name,middle name or initial,last name.',
      user_friendly: 'Contact name',
      name: '',
      properties: []
    };

    metadata = new Metadata({
      schema: schema as JsonSchemaProperty,
      key: 'contact',
      isRequired: false
    });


    TestBed.configureTestingModule({
      declarations: [ BaseInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseInputComponent);
    component = fixture.componentInstance;
    component.metadata = metadata;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise attributes based on its property', () => {

    expect(component.helperText).toEqual('Enter in the format: first name,middle name or initial,last name.');
    expect(component.isRequired).toEqual(false);
    expect(component.disabled).toEqual(false);
    expect(component.placeholder).toEqual('John,D,Doe; Jane,,Smith');
    expect(component.label).toEqual('Contact name');

  });
});
