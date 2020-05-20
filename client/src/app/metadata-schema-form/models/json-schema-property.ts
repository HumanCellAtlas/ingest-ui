import {JsonSchema} from './json-schema';

export interface JsonSchemaProperty extends JsonSchema {
  user_friendly: string;
  example: string;
  items?: object;
  guidelines?: string;
  enum?: string[];
}
