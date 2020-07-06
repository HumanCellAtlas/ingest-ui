import {JsonSchema} from './json-schema';
import {Metadata} from './metadata';
import {MetadataFormConfig} from './metadata-form-config';
import {JsonSchemaProperty} from './json-schema-property';
import {SchemaHelper} from './schema-helper';

const INPUT_TYPE = {
  string: 'text',
  boolean: 'checkbox',
  integer: 'number'
};

export class MetadataRegistry {
  metadataRegistry: object;
  config: MetadataFormConfig;
  jsonSchema: JsonSchema;
  key: string;

  constructor(key: string, jsonSchema: JsonSchema, config?: MetadataFormConfig) {
    this.key = key;
    this.jsonSchema = jsonSchema;
    this.config = config;
    this.metadataRegistry = {};
    
    this.buildMetadataRegistry(this.key, jsonSchema);

    if (this.config && this.config.overrideRequiredFields) {
      this.overrideRequiredFields(this.config.overrideRequiredFields);
    }
  }

  get(key: string): Metadata | undefined {
    return this.metadataRegistry[key];
  }

  private createMetadata(jsonSchema: JsonSchema, key: string): Metadata {
    const property = SchemaHelper.getProperty(key, jsonSchema);

    const requiredFields = jsonSchema.required ? jsonSchema.required : [];
    const hiddenFields = this.config && this.config.hideFields ? this.config.hideFields : [];
    const disabledFields = this.config && this.config.disableFields ? this.config.hideFields : [];
    const isRequired = requiredFields.indexOf(key) >= 0;
    const isHidden = hiddenFields.indexOf(key) >= 0;
    const isDisabled = this.config && this.config.viewMode || disabledFields.indexOf(key) >= 0;
    const inputType = this.config && this.config.inputType && this.config.inputType[key] ?
      this.config.inputType[key] : INPUT_TYPE[property ? property.type : jsonSchema.type];

    const metadataField = new Metadata({
      isRequired: isRequired,
      isHidden: isHidden,
      isDisabled: isDisabled,
      key: key,
      schema: property ? property : jsonSchema as JsonSchemaProperty,
      inputType: inputType
    });

    return metadataField;
  }

  private buildMetadataRegistry(parentKey: string, jsonSchema: JsonSchema): void {
    const registry = this.metadataRegistry;

    let parentMetadata;
    if (registry[parentKey] === undefined) {
      parentMetadata = this.createMetadata(jsonSchema, parentKey);
      registry[parentKey] = parentMetadata;
    } else {
      parentMetadata = registry[parentKey];
    }

    for (const key of Object.keys(jsonSchema.properties)) {
      let metadata: Metadata;
      const metadataKey = parentKey ? parentKey + '.' + key : key;
      if (registry[metadataKey] === undefined) {
        metadata = this.createMetadata(jsonSchema, key);
        registry[metadataKey] = metadata;
      } else {
        metadata = registry[metadataKey];
      }

      parentMetadata.addChild(metadataKey);
      parentMetadata.addChildMetadata(metadata);
      metadata.setParent(parentKey);
      metadata.setParentMetadata(parentMetadata);

      if (parentMetadata.isHidden) {
        metadata.setHidden(true);
      }

      if (metadata.isScalar()) {
      } else if (metadata.isScalarList()) {

      } else if (metadata.isObject()) {
        this.buildMetadataRegistry(metadataKey, metadata.schema as JsonSchema);

      } else if (metadata.isObjectList()) {

        metadata.itemMetadata = this.createMetadata(metadata.schema.items as JsonSchema, metadataKey);
        metadata.itemMetadata.childrenMetadata = metadata.childrenMetadata;
        metadata.itemMetadata.parentMetadata = metadata.parentMetadata;
        this.buildMetadataRegistry(metadataKey, metadata.schema.items as JsonSchema);

      }
    }
  }

  private overrideRequiredFields(fieldMap: { [key: string]: boolean }) {
    for (const field of Object.keys(fieldMap)) {
      const isRequired = fieldMap[field];
      const metadata = this.metadataRegistry[field];
      metadata.isRequired = isRequired;
    }
  }
}
