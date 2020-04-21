import {JsonSchema} from './json-schema';

export interface JsonSchemaProperty extends JsonSchema {
  // key: string;
  user_friendly: string;
  example: string;
  // is_required_property: boolean;
  items?: object;
}
