import {JsonSchemaProperty} from './json-schema-property';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

const FIELD_TYPE = {
  string: 'input',
  boolean: 'checkbox',
  number: 'input'
};

export class Metadata {
  schema: JsonSchemaProperty;
  key: string;
  isRequired: boolean;
  isDisabled: boolean;
  isHidden: boolean;

  parent: string;
  children?: string[];

  fieldType: string;
  control: any;
  parentMetadata: Metadata;


  constructor(options: {
    schema: JsonSchemaProperty,
    key: string,
    isRequired?: boolean,
    isDisabled?: boolean
    isHidden?: boolean,

    parent?: string
    children?: string[]
  }) {
    this.schema = options.schema;
    this.key = options.key;
    this.isRequired = options.isRequired === undefined ? false : options.isRequired;
    this.isDisabled = options.isDisabled === undefined ? false : options.isDisabled;
    this.isHidden = options.isHidden === undefined ? false : options.isHidden;
    this.children = [];
    this.fieldType = this.schema && this.schema.type ? FIELD_TYPE[this.schema.type] : undefined;
  }

  isObjectList(): boolean {
    const items = this.schema.items ? this.schema.items : {};
    return (['array'].indexOf(this.schema.type) >= 0) && !!items['$schema'];
  }

  isObject(): boolean {
    return (['object'].indexOf(this.schema.type) >= 0) && !!this.schema['$schema'];

  }

  isScalar(): boolean {
    return ['object', 'array'].indexOf(this.schema.type) < 0;
  }

  isScalarList(): boolean {
    const items = this.schema.items ? this.schema.items : {};
    return this.schema.type === 'array' && ['array', 'object'].indexOf(items['type']) < 0;
  }

  addChild(key: string) {
    this.children.push(key);
  }

  setParent(key: string) {
    this.parent = key;
  }

  setParentMetadata(metadata: Metadata) {
    this.parentMetadata = metadata;
  }

  setControl(control: FormGroup | FormArray | FormControl) {
    this.control = control;
  }

}

