import {MetadataFormService} from './metadata-form.service';
import * as jsonSchema from './test-json-schema.json';
import * as json from './test-json.json';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {MetadataField} from './metadata-field';
import {JsonSchema} from './json-schema';
import {JsonSchemaProperty} from './json-schema-property';

describe('MetadataFormService', () => {

  let service: MetadataFormService;
  let testSchema: JsonSchema;

  beforeEach(() => {
    service = new MetadataFormService();
    testSchema = (jsonSchema as any).default;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFieldMap', () => {
    it('return list of Property objects from non-nested schema', () => {
      // given testSchema
      // when
      const fieldMap = service.getFieldMap(testSchema);

      // then
      const actual_properties = Array.from(fieldMap.keys());

      const expected_properties = [
        'describedBy',
        'schema_type',
        'schema_version',
        'array_express_accessions',
        'biostudies_accessions',
        'geo_series_accessions',
        'insdc_project_accessions',
        'insdc_study_accessions',
        'supplementary_links',
        'contributors',
        'funders',
        'publications'
      ];

      expected_properties.forEach(prop => expect(actual_properties).toContain(prop));

    });
  });

  describe('toFormGroup', () => {
    it('return a FormGroup object', () => {
      // given testSchema
      // when
      const formGroup = service.toFormGroup(testSchema);

      // then
      expect(formGroup).toBeTruthy();
      expect(formGroup.get('array_express_accessions') instanceof FormArray).toEqual(true);
      expect(formGroup.get('schema_type') instanceof FormControl).toEqual(true);
      expect(formGroup.get('contributors') instanceof FormArray).toEqual(true);
      expect(formGroup.get('project_core') instanceof FormGroup).toEqual(true);
    });


    it('return a FormGroup object with initialised data', () => {
      // given
      const schema = service.getProperty('contributors', testSchema).items as JsonSchema;
      const data = {
        'name': 'Nathan Smith',
        'institution': 'MRCN',
        'corresponding_contributor': false
      };
      // when
      const formGroup = service.toFormGroup(schema as JsonSchema, {}, data);

      // then
      expect(formGroup instanceof FormGroup).toEqual(true);
      expect(Object.keys(formGroup.controls).length).toEqual(12);
      expect(formGroup.controls['name'] instanceof FormControl).toEqual(true);
      expect(service.cleanFormData(formGroup.value)).toEqual(data);
    });

  });

  describe('toFormControl', () => {
    it('return a toFormControl object', () => {
      // given
      const field: MetadataField = new MetadataField({
        schema: undefined,
        key: 'project',
        isRequired: false
      });

      // when
      const formControl = service.toFormControl(field);

      // then
      expect(formControl instanceof FormControl).toEqual(true);
      expect(formControl.value).toEqual(null);
      expect(formControl.validator).toEqual(null);
    });

    it('return a toFormControl object with validator', () => {
      // given
      const field: MetadataField = new MetadataField({
        schema: undefined,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });

      // when
      const formControl = service.toFormControl(field);
      // then
      expect(formControl instanceof FormControl).toEqual(true);
      expect(formControl.value).toEqual(null);
      expect(formControl.validator).toEqual(Validators.required);
    });

    it('return a toFormControl object with string data', () => {
      // given
      const field: MetadataField = new MetadataField({
        schema: undefined,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });

      // when
      const formControl = service.toFormControl(field, 'string');

      // then
      expect(formControl instanceof FormControl).toEqual(true);
      expect(formControl.value).toEqual('string');
    });

    it('return a toFormControl object with blank string', () => {
      // given
      const field: MetadataField = new MetadataField({
        schema: undefined,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });

      // when
      const formControl = service.toFormControl(field, '');

      // then
      expect(formControl instanceof FormControl).toEqual(true);
      expect(formControl.value).toEqual('');
    });

    it('return a toFormControl object with empty array', () => {
      // given
      const field: MetadataField = new MetadataField({
        schema: undefined,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });

      // when
      const formControl = service.toFormControl(field, []);

      // then
      expect(formControl instanceof FormControl).toEqual(true);
      expect(formControl.value).toEqual([]);
    });

    it('return a toFormControl object with empty object', () => {
      // given
      const field: MetadataField = new MetadataField({
        schema: undefined,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });

      // when
      const formControl = service.toFormControl(field, {});

      // then
      expect(formControl instanceof FormControl).toEqual(true);
      expect(formControl.value).toEqual({});
    });

    it('return a toFormControl object with number data', () => {
      // given
      const field: MetadataField = new MetadataField({
        schema: undefined,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });

      // when
      const formControl = service.toFormControl(field, 100);

      // then
      expect(formControl instanceof FormControl).toEqual(true);
      expect(formControl.value).toEqual(100);
    });

    it('return a toFormControl object with boolean data', () => {
      // given
      const field: MetadataField = new MetadataField({
        schema: undefined,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });

      // when
      const formControl = service.toFormControl(field, false);

      // then
      expect(formControl instanceof FormControl).toEqual(true);
      expect(formControl.value).toEqual(false);
    });
  });

  describe('toFormGroupArray', () => {
    it('return a FormArray of FormGroup', () => {
      // given
      const schema = service.getProperty('contributors', testSchema);

      // when
      const formArray = service.toFormGroupArray(schema.items as JsonSchema, {}, undefined);

      // then
      expect(formArray instanceof FormArray).toEqual(true);
      expect(formArray.controls[0] instanceof FormGroup).toEqual(true);
      expect(service.cleanFormData(formArray.value)).toEqual([]);
    });

    it('return a FormArray of FormGroup with data', () => {
      // given
      const schema = service.getProperty('contributors', testSchema);
      const data = [
        {
          'name': 'Nathan Smith',
          'institution': 'MRCN',
          'corresponding_contributor': false
        },
        {
          'name': 'Jules-Pierre Mao',
          'institution': 'Protogen',
          'corresponding_contributor': false
        },
        {
          'name': 'Lawrence Strickland',
          'institution': 'Protogen',
          'corresponding_contributor': true
        }
      ];
      // when
      const formArray = service.toFormGroupArray(schema.items as JsonSchema, {}, data);

      // then
      expect(formArray instanceof FormArray).toEqual(true);
      expect(formArray.controls[0] instanceof FormGroup).toEqual(true);
      expect(service.cleanFormData(formArray.value)).toEqual(data);
    });
  });

  describe('toFormControlArray', () => {
    it('return a FormArray of FormControl', () => {
      // given
      const schema = service.getProperty('insdc_study_accessions', testSchema);
      const field: MetadataField = new MetadataField({
        schema: schema,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });

      // when
      const formArray = service.toFormControlArray(field, undefined);

      // then
      expect(formArray instanceof FormArray).toEqual(true);
      expect(formArray.controls[0] instanceof FormControl).toEqual(true);
      expect(service.cleanFormData(formArray.value)).toEqual([]);
    });

    it('return a FormArray of FormControl with initialised data', () => {
      // given
      const schema = service.getProperty('insdc_study_accessions', testSchema);
      const field: MetadataField = new MetadataField({
        schema: schema,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });
      const data = ['string1', 'string2', 'string3'];
      // when
      const formArray = service.toFormControlArray(field, data);

      // then
      expect(formArray instanceof FormArray).toEqual(true);
      expect(formArray.controls[0] instanceof FormControl).toEqual(true);
      expect(service.cleanFormData(formArray.value)).toEqual(data);
    });

    it('return a FormArray of FormControl with initialised boolean data array', () => {
      // given
      const schema = {
        'description': '',
        'example': '',
        'guidelines': '',
        'items': {
          'type': 'boolean'
        },
        'type': 'array',
        'user_friendly': ''
      } as JsonSchemaProperty;

      const field: MetadataField = new MetadataField({
        schema: schema,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });
      const data = [false, false, false];
      // when
      const formArray = service.toFormControlArray(field, data);

      // then
      expect(formArray instanceof FormArray).toEqual(true);
      expect(formArray.controls[0] instanceof FormControl).toEqual(true);
      expect(service.cleanFormData(formArray.value)).toEqual(data);
    });
  });

  describe('initializeFormConfig', () => {
    it('return config', () => {
      // given testSchema
      // when
      const formConfig = {};
      const config = service.initializeFormConfig(formConfig, 'project', testSchema);

      // then
      expect(config).toBeTruthy();

      const formGroup = config['project']['formControl'];
      expect(formGroup.get('array_express_accessions') instanceof FormArray).toEqual(true);
      expect(formGroup.get('schema_type') instanceof FormControl).toEqual(true);
      expect(formGroup.get('contributors') instanceof FormArray).toEqual(true);
      expect(formGroup.get('project_core') instanceof FormGroup).toEqual(true);

    });

    describe('initializeFormConfig with data', () => {
      it('return config with data', () => {
        // given
        const testData = (json as any).default;
        // when
        const formConfig = {};
        const config = service.initializeFormConfig(formConfig, 'project', testSchema, {}, testData);

        // then
        expect(config).toBeTruthy();

        const formGroup = config['project']['formControl'];
        expect(formGroup.get('array_express_accessions') instanceof FormArray).toEqual(true);
        expect(formGroup.get('schema_type') instanceof FormControl).toEqual(true);
        expect(formGroup.get('contributors') instanceof FormArray).toEqual(true);
        expect(formGroup.get('project_core') instanceof FormGroup).toEqual(true);

        expect(service.cleanFormData(formGroup.value))
          .toEqual(service.cleanFormData(testData));

      });

    });


    describe('copy', () => {
      it('return copy', () => {
        // given
        const obj = {
          'k1': 'v1',
          'k2': {
            'k3': null,
            'k4': null,
            'k5': [],
            'k0': {}
          },
          'k6': ['v2', 'v3'],
          'k7': {
            'k8': 'v4',
            'k9': null,
            'k10': null
          },
          'k11': [{
            'k12': 'v5',
            'k13': 'v6',
          }, {
            'k14': 'v7'
          }],
          'k15': [{}, {}],
          'k16': [null, null],
          'k17': {
            'k18': 8,
            'k19': null
          },
          'k20': {
            'k21': 'v9',
            'k22': null
          }
        };

        // when
        const copy = service.copyValues(obj);

        const expected = {
          'k1': 'v1',
          'k6': ['v2', 'v3'],
          'k7': {
            'k8': 'v4',
          },
          'k11': [{
            'k12': 'v5',
            'k13': 'v6',
          }, {
            'k14': 'v7'
          }],
          'k17': {
            'k18': 8
          },
          'k20': {
            'k21': 'v9'
          }
        };

        // then
        expect(copy).toEqual(expected);
      });
    });
  });
});
