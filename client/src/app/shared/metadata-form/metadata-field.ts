import {JsonSchemaProperty} from './json-schema-property';


export class MetadataField {
  schema: JsonSchemaProperty;
  key: string;
  isRequired: boolean;
  isDisabled: boolean;
  isHidden: boolean;


  constructor(options: {
    schema: JsonSchemaProperty,
    key: string,
    isRequired: boolean,
    isDisabled?: boolean
    isHidden?: boolean
  }) {
    this.schema = options.schema;
    this.key = options.key;
    this.isRequired = options.isRequired;
    this.isDisabled = options.isDisabled === undefined ? false : options.isDisabled;
    this.isHidden = options.isHidden === undefined ? false : options.isHidden;

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

}
