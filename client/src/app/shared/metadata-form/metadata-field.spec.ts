import {MetadataField} from './metadata-field';
import * as jsonSchema from './test-json-schema.json';
import {JsonSchemaProperty} from './json-schema-property';

describe('MetadataField', () => {
  beforeEach(() => {
  });

  describe('MetadataField types', () => {
    describe('isScalar', () => {
      it('return True', () => {
        // given
        const scalar = {
          description: 'The URL reference to the schema.',
          type: 'string'
        } as unknown as JsonSchemaProperty;
        // when
        const field = new MetadataField({is_required: false, key: 'describedBy', schema: scalar});

        // then
        expect(field.isScalar()).toEqual(true);

      });
    });

    describe('isScalarList', () => {
      it('return True', () => {
        // given
        const scalarList = {
          'description': 'An ArrayExpress accession.',
          'example': 'E-AAAA-00',
          'items': {
            'pattern': '^E-[A-Z]{4}-\\d+$',
            'type': 'string'
          },
          'type': 'array',
          'user_friendly': 'ArrayExpress accession'
        } as JsonSchemaProperty;

        // when
        const field = new MetadataField({is_required: false, key: 'array_express_accessions', schema: scalarList});
        // then
        expect(field.isScalarList()).toEqual(true);
      });
    });

    describe('isObject', () => {
      it('return True', () => {
        // given
        const testSchema = (jsonSchema as any).default;

        // when
        const obj = {
          '$schema': 'http://json-schema.org/draft-07/schema#',
          '$id': 'http://schema.dev.data.humancellatlas.org/core/project/7.0.5/project_core',
          'description': 'Information about the project.',
          'additionalProperties': false,
          'required': [
            'project_short_name',
            'project_title',
            'project_description'
          ],
          'title': 'Project core',
          'name': 'project_core',
          'type': 'object',
          'properties': {
            'describedBy': {
              'description': 'The URL reference to the schema.',
              'type': 'string',
            },
            'schema_version': {
              'description': 'The version number of the schema in major.minor.patch format.',
              'type': 'string',
              'pattern': '^[0-9]{1,}.[0-9]{1,}.[0-9]{1,}$',
              'example': '4.6.1'
            },
            'project_short_name': {
              'description': 'A short name for the project.',
              'type': 'string',
              'example': 'CoolOrganProject.',
              'user_friendly': 'Project label',
            },
            'project_title': {
              'description': 'An official title for the project.',
              'type': 'string',
              'example': 'Study of single cells in the human body.',
              'user_friendly': 'Project title',
            },
            'project_description': {
              'description': 'A longer description of the project which includes research goals and experimental approach.',
              'type': 'string',
              'user_friendly': 'Project description',
            }
          }
        } as JsonSchemaProperty;

        const field = new MetadataField({is_required: true, key: 'array_express_accessions', schema: obj});
        // then
        expect(field.isObject()).toEqual(true);

      });
    });

    describe('isObjectList', () => {
      it('return True', () => {
        // given
        const testSchema = (jsonSchema as any).default;

        // when
        const objectList = {
          'description': 'People contributing to any aspect of the project.',
          'items': {
            '$schema': 'http://json-schema.org/draft-07/schema#',
            '$id': 'https://schema.dev.data.humancellatlas.org/module/project/8.0.1/contact',
            'description': 'Information about an individual who submitted or contributed to a project.',
            'additionalProperties': false,
            'required': [
              'name',
              'institution'
            ],
            'title': 'Contact',
            'name': 'contact',
            'type': 'object',
            'properties': {
              'describedBy': {
                'description': 'The URL reference to the schema.',
                'type': 'string'
              },
              'schema_version': {
                'description': 'The version number of the schema in major.minor.patch format.',
                'type': 'string',
                'pattern': '^[0-9]{1,}.[0-9]{1,}.[0-9]{1,}$',
                'example': '4.6.1'
              },
              'name': {
                'description': 'Name of individual who has contributed to the project.',
                'type': 'string',
                'example': 'John,D,Doe; Jane,,Smith',
                'guidelines': 'Enter in the format: first name,middle name or initial,last name.',
                'user_friendly': 'Contact name'
              }
            }
          },
          'type': 'array',
          'user_friendly': 'Contributors'
        } as JsonSchemaProperty;

        const field = new MetadataField({is_required: true, key: 'array_express_accessions', schema: objectList});

        // then
        expect(field.isObjectList()).toEqual(true);

      });
    });
  });

});
