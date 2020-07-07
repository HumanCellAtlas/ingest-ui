import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PublicationFieldGroupComponent} from './publication-field-group.component';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';

describe('PublicationFieldGroupComponent', () => {
  let component: PublicationFieldGroupComponent;
  let fixture: ComponentFixture<PublicationFieldGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublicationFieldGroupComponent]
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
        'publications': {
          'description': 'Publications resulting from this project.',
          'items': {
            '$schema': 'http://json-schema.org/draft-07/schema#',
            '$id': 'https://schema.dev.data.humancellatlas.org/module/project/6.0.0/publication',
            'description': 'Information about a journal article, book, web page, or other external available documentation for a project.',
            'additionalProperties': false,
            'required': [
              'authors',
              'title'
            ],
            'title': 'Publication',
            'name': 'publication',
            'type': 'object',
            'properties': {
              'describedBy': {
                'description': 'The URL reference to the schema.',
                'type': 'string',
                'pattern': '^(http|https)://schema.(.*?)humancellatlas.org/module/project/(([0-9]{1,}.[0-9]{1,}.[0-9]{1,})|([a-zA-Z]*?))/publication'
              },
              'schema_version': {
                'description': 'The version number of the schema in major.minor.patch format.',
                'type': 'string',
                'pattern': '^[0-9]{1,}.[0-9]{1,}.[0-9]{1,}$',
                'example': '4.6.1'
              },
              'authors': {
                'description': 'A list of authors associated with the publication.',
                'type': 'array',
                'example': 'Doe JD',
                'items': {
                  'type': 'string'
                },
                'user_friendly': 'Authors',
                'guidelines': 'List each author in \'surname initials\' format.'
              },
              'title': {
                'description': 'The title of the publication.',
                'type': 'string',
                'user_friendly': 'Publication title',
                'example': 'Study of single cells in the human body.'
              },
              'doi': {
                'description': 'The publication digital object identifier (doi) of the publication.',
                'type': 'string',
                'example': '10.1016/j.cell.2016.07.054',
                'user_friendly': 'Publication DOI'
              },
              'pmid': {
                'description': 'The PubMed ID of the publication.',
                'type': 'integer',
                'example': '27565351',
                'user_friendly': 'Publication PMID'
              },
              'url': {
                'description': 'A URL for the publication.',
                'type': 'string',
                'user_friendly': 'Publication URL',
                'example': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5667944/'
              }
            }
          },
          'type': 'array',
          'user_friendly': 'Publications'
        }
      },
      'title': 'Project',
      'type': 'object'
    };

    fixture = TestBed.createComponent(PublicationFieldGroupComponent);
    component = fixture.componentInstance;
    component.metadataForm = new MetadataForm('project', schema);
    component.publicationKey = 'project.publications';
    component.publicationUrlId = 'project.publications.url';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
