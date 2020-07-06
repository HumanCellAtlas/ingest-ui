import {JsonSchema} from './json-schema';
import {JsonSchemaProperty} from './json-schema-property';

export class SchemaHelper {
  public static getProperty(key: string, jsonSchema: JsonSchema): JsonSchemaProperty {
    return jsonSchema.properties[key];
  }
}
