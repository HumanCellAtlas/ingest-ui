import {MetadataFormService} from './metadata-form.service';
import * as jsonSchema from './test-json-schema.json';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

describe('MetadataFormService', () => {

  let service: MetadataFormService;

  beforeEach(() => {
    service = new MetadataFormService();

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFieldMap', () => {
    it('return list of Property objects from non-nested schema', () => {
      // given
      const testSchema = (jsonSchema as any).default;

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
      // given
      const testSchema = (jsonSchema as any).default;

      // when
      const formGroup = service.toFormGroup(testSchema);

      // then
      console.log(formGroup);
      expect(formGroup).toBeTruthy();
      expect(formGroup.get('array_express_accessions') instanceof FormArray).toEqual(true);
      expect(formGroup.get('schema_type') instanceof FormControl).toEqual(true);
      expect(formGroup.get('contributors') instanceof FormArray).toEqual(true);
      expect(formGroup.get('project_core') instanceof FormGroup).toEqual(true);
      // TODO add more assertions
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
