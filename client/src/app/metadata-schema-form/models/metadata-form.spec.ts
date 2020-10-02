import * as jsonSchema from '../test-json-files/test-json-schema.json';
import * as json from '../test-json-files/test-json.json';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {JsonSchema} from './json-schema';
import {JsonSchemaProperty} from './json-schema-property';
import {MetadataForm} from './metadata-form';
import {MetadataFormService} from '../metadata-form.service';
import {MetadataFormConfig} from './metadata-form-config';

describe('MetadataForm', () => {
  let testSchema: JsonSchema;
  let metadataFormSvc: MetadataFormService;

  beforeEach(() => {
    testSchema = (jsonSchema as any).default;
    metadataFormSvc = new MetadataFormService();
  });

  it('return FormGroup obj', () => {
    // given testSchema

    // when
    const metadataForm = new MetadataForm('project', testSchema);
    const formGroup = metadataForm.formGroup;

    // then
    expect(formGroup.get('array_express_accessions') instanceof FormArray).toEqual(true);
    expect(formGroup.get('schema_type') instanceof FormControl).toEqual(true);
    expect(formGroup.get('contributors') instanceof FormArray).toEqual(true);
    expect(formGroup.get('project_core') instanceof FormGroup).toEqual(true);
    expect(metadataFormSvc.cleanFormData(formGroup.value))
      .toEqual({});

  });

  it('return FormGroup obj with data', () => {
    // given
    const testData = (json as any).default;

    // when
    const metadataForm = new MetadataForm('project', testSchema, testData);
    const formGroup = metadataForm.formGroup;

    // then
    expect(formGroup.get('array_express_accessions') instanceof FormArray).toEqual(true);
    expect(formGroup.get('schema_type') instanceof FormControl).toEqual(true);
    expect(formGroup.get('contributors') instanceof FormArray).toEqual(true);
    expect(formGroup.get('project_core') instanceof FormGroup).toEqual(true);

    expect(metadataFormSvc.cleanFormData(formGroup.value))
      .toEqual(metadataFormSvc.cleanFormData(testData));

  });

  it('return metadataRegistry', () => {
    // given
    const testData = (json as any).default;

    // when
    const metadataForm = new MetadataForm('project', testSchema, testData);
    const metadataRegistry = metadataForm.metadataRegistry;

    // then
    expect(metadataRegistry).toBeTruthy();
    expect(metadataForm.get('project').schema).toEqual(testSchema as JsonSchemaProperty);
  });

  it('return metadataRegistry with config', () => {
    // given
    const testData = (json as any).default;
    const config: MetadataFormConfig = {
      hideFields: [
        'describedBy',
        'schema_version',
        'schema_type',
        'provenance'
      ]
    };

    // when
    const metadataForm = new MetadataForm('project', testSchema, testData, config);
    const metadataRegistry = metadataForm.metadataRegistry;

    // then
    expect(metadataRegistry).toBeTruthy();
    expect(metadataForm.get('project.describedBy').isHidden).toEqual(true);
    expect(metadataForm.get('project.schema_version').isHidden).toEqual(true);
    expect(metadataForm.get('project.schema_type').isHidden).toEqual(true);
    expect(metadataForm.get('project.provenance').isHidden).toEqual(true);
  });

  describe('getControl', () => {
    let metadataForm: MetadataForm;
    let testData: object;

    beforeEach(() => {
      testData = (json as any).default;
      metadataForm = new MetadataForm('project', testSchema, testData);
    });

    it('return form group given a level 0 key', () => {
      // given metadataForm

      // when
      const projectControl = metadataForm.getControl('project');

      // then
      const formGroup = metadataForm.formGroup;

      expect(projectControl).toEqual(formGroup);
      expect(projectControl instanceof FormGroup).toEqual(true);
    });

    it('return form control given a level 1 key - scalar value', () => {
      // given metadataForm

      // when
      const control = metadataForm.getControl('project.describedBy');

      // then
      const formGroup = metadataForm.formGroup;

      expect(control).toEqual(formGroup['controls']['describedBy']);
      expect(control instanceof FormControl).toEqual(true);
      expect(control.value).toEqual('https://schema.dev.data.humancellatlas.org/type/project/15.0.0/project');
    });

    it('return form group given a level 1 key - scalar value', () => {
      // given metadataForm

      // when
      const control = metadataForm.getControl('project.project_core');

      // then
      const formGroup = metadataForm.formGroup;
      const formData = metadataFormSvc.cleanFormData(control.value);

      expect(control).toEqual(formGroup['controls']['project_core']);
      expect(control instanceof FormGroup).toEqual(true);
      expect(formData).toEqual(testData['project_core']);
    });

    it('return form control given level 2 - scalar value', () => {
      // given metadataForm

      // when
      const control = metadataForm.getControl('project.project_core.project_title');

      // then
      const formGroup = metadataForm.formGroup;
      const projectCore = formGroup['controls']['project_core'];

      expect(control).toEqual(projectCore['controls']['project_title']);
      expect(control instanceof FormControl).toEqual(true);
      expect(control.value).toEqual('Sequencing of Phoebe core samples');
    });

    it('return form array given a level 1 key - array', () => {
      // given metadataForm

      // when
      const control = metadataForm.getControl('project.publications');

      // then
      const formGroup = metadataForm.formGroup;
      const publications = formGroup['controls']['publications'];

      expect(control).toEqual(publications);
      expect(control instanceof FormArray).toEqual(true);
      expect(metadataFormSvc.cleanFormData(control.value)).toEqual([{
        'authors': [
          'Corey JSA',
          'Franck T',
          'Abraham D'
        ],
        'title': 'Leviathan Wakes',
        'url': 'https://expanse.fandom.com/wiki/Leviathan_Wakes'
      },
        {
          'authors': [
            'Fergus M',
            'Ostby H',
            'McDonough T'
          ],
          'title': 'The Expanse',
          'url': 'https://expanse.fandom.com/wiki/Season_1'
        }
      ]);
    });


    it('return form array given a level 2 key - array, with root control', () => {
      // given metadataForm
      const formGroup = metadataForm.formGroup;
      const publications = formGroup['controls']['publications'];

      // when
      const control = metadataForm.getControl('.authors', publications['controls'][0]);

      // then
      expect(control).toEqual(publications['controls'][0]['controls']['authors']);
      expect(control instanceof FormArray).toEqual(true);
      expect(metadataFormSvc.cleanFormData(control.value)).toEqual([
        'Corey JSA',
        'Franck T',
        'Abraham D'
      ]);
    });

  });
});
