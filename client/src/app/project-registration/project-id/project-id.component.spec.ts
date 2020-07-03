import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectIdComponent} from './project-id.component';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';

describe('ProjectIdComponent', () => {
  let component: ProjectIdComponent;
  let fixture: ComponentFixture<ProjectIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectIdComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const schema = {
      '$schema': 'http://json-schema.org/draft-07/schema#',
      'additionalProperties': false,
      'description': 'A ingest project entity contains information about the ingestion of the project.',
      'name': 'project',
      'properties': {
        'identifyingOrganisms': {
          'description': 'Organism the samples were generated from',
          'guidelines': 'You can select multiple entries',
          'type': 'array',
          'items': {
            'type': 'string'
          },
          'enum': [
            'Human',
            'Mouse',
            'Other'
          ],
          'user_friendly': 'Organism the samples were generated from'
        },
        'technology': {
          '$schema': 'http://json-schema.org/draft-07/schema#',
          'description': 'Technology',
          'title': 'Technology',
          'name': 'technology',
          'type': 'object',
          'properties': {
            'ontologies': {
              'description': 'The general methods used for sequencing library construction in your project.',
              'guidelines': 'Start typing to select the technology. You can select multiple entries.',
              'type': 'array',
              'items': {
                '$schema': 'http://json-schema.org/draft-07/schema#',
                '$id': 'https://schema.dev.data.humancellatlas.org/module/ontology/1.2.5/library_construction_ontology',
                'description': 'A term that may be associated with a process-related ontology term.',
                'additionalProperties': false,
                'required': [
                  'text'
                ],
                'title': 'Library construction ontology',
                'name': 'library_construction_ontology',
                'type': 'object',
                'properties': {
                  'text': {
                    'description': 'The name of a library construction approach being used.',
                    'type': 'string',
                    'user_friendly': 'Library construction',
                    'example': '10X v2 sequencing; Smart-seq2'
                  },
                  'ontology': {
                    'description': 'An ontology term identifier in the form prefix:accession.',
                    'type': 'string',
                    'graph_restriction': {
                      'ontologies': [
                        'obo:efo'
                      ],
                      'classes': [
                        'OBI:0000711'
                      ],
                      'relations': [
                        'rdfs:subClassOf'
                      ],
                      'direct': false,
                      'include_self': false
                    },
                    'user_friendly': 'Library construction ontology ID',
                    'example': 'EFO:0009310; EFO:0008931'
                  },
                  'ontology_label': {
                    'description': 'The preferred label for the ontology term referred to in the ontology field. This may differ from the user-supplied value in the text field.',
                    'type': 'string',
                    'user_friendly': 'Library construction ontology label',
                    'example': '10X v2 sequencing; Smart-seq2'
                  }
                }
              },
              'user_friendly': 'Technologies used to generate the data'
            },
            'others': {
              'description': 'Other technologies not in the ontologies for technology.',
              'type': 'array',
              'items': {
                'type': 'string'
              },
              'user_friendly': 'Other Technologies',
              'guidelines': 'Other technologies not in the options above.'
            }
          }
        },
        'content': {
          '$id': 'https://schema.dev.data.humancellatlas.org/type/project/15.0.0/project',
          '$schema': 'http://json-schema.org/draft-07/schema#',
          'additionalProperties': false,
          'description': 'A project entity contains information about the overall project.',
          'name': 'project',
          'type': 'object',
          'properties': {
            'contributors': {
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
                  'name': {
                    'description': 'Name of individual who has contributed to the project.',
                    'type': 'string',
                    'example': 'John,D,Doe; Jane,,Smith',
                    'guidelines': 'Enter in the format: first name,middle name or initial,last name.',
                    'user_friendly': 'Contact name'
                  },
                  'email': {
                    'description': 'Email address for the individual.',
                    'type': 'string',
                    'example': 'dummy@email.com',
                    'format': 'email',
                    'user_friendly': 'Email address'
                  },
                  'corresponding_contributor': {
                    'description': 'Whether the individual is a primary point of contact for the project.',
                    'type': 'boolean',
                    'user_friendly': 'Corresponding contributor',
                    'example': 'Should be one of: yes, or no.'
                  }
                }
              },
              'type': 'array',
              'user_friendly': 'Contributors'
            }
          },
          'project_core': {
            '$schema': 'http://json-schema.org/draft-07/schema#',
            '$id': 'http://schema.dev.data.humancellatlas.org/core/project/7.0.5/project_core',
            'description': 'Information about the project.',
            'additionalProperties': false,
            'required': [
              'project_short_name'
            ],
            'title': 'Project core',
            'name': 'project_core',
            'type': 'object',
            'properties': {
              'project_short_name': {
                'description': 'A short name for the project.',
                'type': 'string',
                'example': 'CoolOrganProject.',
                'user_friendly': 'Project label'
              }
            }
          }
        }
      },
      'required': [],
      'title': 'Ingest Project',
      'type': 'object',
      '$id': ''
    };

    const metadataForm = new MetadataForm('project', schema);
    console.log('mxetadataForm', metadataForm);
    fixture = TestBed.createComponent(ProjectIdComponent);
    component = fixture.componentInstance;
    component.metadataForm = metadataForm;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
})
;
