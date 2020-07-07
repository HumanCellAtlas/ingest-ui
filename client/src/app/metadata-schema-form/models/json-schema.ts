export interface JsonSchema {
  '$id': string;
  '$schema': string;
  type: string;
  format?: string;
  additionalProperties?: boolean;
  description: string;
  name: string;
  properties: object;
  required?: string[];
  title?: string;
}
