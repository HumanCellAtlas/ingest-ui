import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AccessionFieldGroupComponent} from './accession-field-group.component';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';
import {FormArray} from '@angular/forms';

describe('AccessionFieldGroupComponent', () => {
  let component: AccessionFieldGroupComponent;
  let fixture: ComponentFixture<AccessionFieldGroupComponent>;

  let arrayExpressCtrl: FormArray;
  let geoSeriesCtrl: FormArray;
  let insdcProjCtrl: FormArray;
  let insdcStudyCtrl: FormArray;
  let bioStudiesCtrl: FormArray;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccessionFieldGroupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const schema = {
      '$id': 'https://schema.dev.data.humancellatlas.org/type/project/15.0.0/project',
      '$schema': 'http://json-schema.org/draft-07/schema#',
      'additionalProperties': false,
      'description': 'A project entity contains information about the overall project.',
      'name': 'project',
      'properties': {
        'array_express_accessions': {
          'description': 'An ArrayExpress accession.',
          'example': 'E-AAAA-00',
          'guidelines': 'Enter accession if project has been archived in ArrayExpress. Accession must start with E-.',
          'items': {
            'pattern': '^E-[A-Z]{4}-\\d+$',
            'type': 'string'
          },
          'type': 'array',
          'user_friendly': 'ArrayExpress accession'
        },
        'biostudies_accessions': {
          'description': 'A BioStudies study accession.',
          'example': 'S-EXMP1; S-HCAS33',
          'guidelines': 'Enter accession if study has been archived in BioStudies.',
          'items': {
            'pattern': '^S-[A-Z]{4}\\d+$',
            'type': 'string'
          },
          'type': 'array',
          'user_friendly': 'BioStudies accession'
        },
        'geo_series_accessions': {
          'description': 'A Gene Expression Omnibus (GEO) series accession.',
          'example': 'GSE00000',
          'guidelines': 'Enter accession if project has been archived in GEO. Accession must start with GSE.',
          'items': {
            'pattern': '^GSE\\d+$',
            'type': 'string'
          },
          'type': 'array',
          'user_friendly': 'GEO series accession'
        },
        'insdc_project_accessions': {
          'description': 'An International Nucleotide Sequence Database Collaboration (INSDC) project accession.',
          'example': 'PRJNS000000',
          'guidelines': 'Enter accession if project has been archived. Accession can be from the DDBJ, NCBI, or EMBL-EBI and must start with PRJD, PRJN, or PRJE, respectively.',
          'items': {
            'pattern': '^PRJ[END][A-Z]\\d+$',
            'type': 'string'
          },
          'type': 'array',
          'user_friendly': 'INSDC project accession'
        },
        'insdc_study_accessions': {
          'description': 'An International Nucleotide Sequence Database Collaboration (INSDC) study accession.',
          'example': 'SRP000000',
          'guidelines': 'Enter accession if study has been archived. Accession can be from the DDBJ, NCBI, or EMBL-EBI and must start with DRP, SRP, or ERP, respectively.',
          'items': {
            'pattern': '^[DES]RP\\d+$',
            'type': 'string'
          },
          'type': 'array',
          'user_friendly': 'INSDC study accession'
        }
      },
      'title': 'Project',
      'type': 'object'
    };
    const metadataForm = new MetadataForm('project', schema);
    fixture = TestBed.createComponent(AccessionFieldGroupComponent);
    component = fixture.componentInstance;
    component.metadataForm = metadataForm;
    component.accessionFields = [
      'project.array_express_accessions',
      'project.biostudies_accessions',
      'project.geo_series_accessions',
      'project.insdc_project_accessions',
      'project.insdc_study_accessions'
    ];
    component.defaultAccessionField = 'project.array_express_accessions';

    fixture.detectChanges();

    arrayExpressCtrl = component.metadataForm.getControl('project.array_express_accessions') as FormArray;
    geoSeriesCtrl = component.metadataForm.getControl('project.geo_series_accessions') as FormArray;
    insdcProjCtrl = component.metadataForm.getControl('project.insdc_project_accessions') as FormArray;
    insdcStudyCtrl = component.metadataForm.getControl('project.insdc_study_accessions') as FormArray;
    bioStudiesCtrl = component.metadataForm.getControl('project.biostudies_accessions') as FormArray;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onProjectAccessionIdChange', () => {
    it('should set the BioStudies accession field', () => {
      component.onProjectAccessionIdChange('S-EXMP1');
      expect(bioStudiesCtrl.value).toEqual(['S-EXMP1']);

      expect(insdcProjCtrl.value).toEqual([]);
      expect(insdcStudyCtrl.value).toEqual([]);
      expect(arrayExpressCtrl.value).toEqual([]);
      expect(geoSeriesCtrl.value).toEqual([]);
    });

    it('should set the ArrayExpress accession field', () => {
      component.onProjectAccessionIdChange('E-AAAA-00');
      expect(arrayExpressCtrl.value).toEqual(['E-AAAA-00']);

      expect(insdcProjCtrl.value).toEqual([]);
      expect(insdcStudyCtrl.value).toEqual([]);
      expect(geoSeriesCtrl.value).toEqual([]);
      expect(bioStudiesCtrl.value).toEqual([]);
    });

    it('should set the GEO series accession field', () => {
      component.onProjectAccessionIdChange('GSE00000');
      expect(geoSeriesCtrl.value).toEqual(['GSE00000']);

      expect(insdcProjCtrl.value).toEqual([]);
      expect(insdcStudyCtrl.value).toEqual([]);
      expect(arrayExpressCtrl.value).toEqual([]);
      expect(bioStudiesCtrl.value).toEqual([]);

    });

    it('should set the INSDC study accession field', () => {
      component.onProjectAccessionIdChange('SRP000000');
      expect(insdcStudyCtrl.value).toEqual(['SRP000000']);

      expect(insdcProjCtrl.value).toEqual([]);
      expect(arrayExpressCtrl.value).toEqual([]);
      expect(geoSeriesCtrl.value).toEqual([]);
      expect(bioStudiesCtrl.value).toEqual([]);
    });

    it('should set the INSDC project accession field', () => {
      component.onProjectAccessionIdChange('PRJNS000000');
      expect(insdcProjCtrl.value).toEqual(['PRJNS000000']);

      expect(arrayExpressCtrl.value).toEqual([]);
      expect(insdcStudyCtrl.value).toEqual([]);
      expect(geoSeriesCtrl.value).toEqual([]);
      expect(bioStudiesCtrl.value).toEqual([]);
    });

    it('should set unrecognised accession to a default accession field', () => {
      component.onProjectAccessionIdChange('XXX');
      expect(arrayExpressCtrl.value).toEqual(['XXX']);

      expect(insdcProjCtrl.value).toEqual([]);
      expect(insdcStudyCtrl.value).toEqual([]);
      expect(geoSeriesCtrl.value).toEqual([]);
      expect(bioStudiesCtrl.value).toEqual([]);
    });

  });

});
