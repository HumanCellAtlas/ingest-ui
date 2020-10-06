/* tslint:disable:max-line-length */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContactFieldGroupComponent} from './contact-field-group.component';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';
import {AaiService} from '../../aai/aai.service';
import {BehaviorSubject} from 'rxjs';
import {Profile, User} from 'oidc-client';

let component: ContactFieldGroupComponent;
let fixture: ComponentFixture<ContactFieldGroupComponent>;
let aaiSpy: jasmine.SpyObj<AaiService>;

describe('ContactFieldGroupComponent', () => {

  beforeEach(async(() => {
    aaiSpy = jasmine.createSpyObj(['getUser']) as jasmine.SpyObj<AaiService>;
    TestBed.configureTestingModule({
      declarations: [ContactFieldGroupComponent],
      providers: [{provide: AaiService, useValue: aaiSpy}],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const profile: Profile = <Profile>{given_name: 'Test', family_name: 'User', email: 'mail'};
    const user: User = <User>{expired: false, profile: profile};
    const behaviourUser = new BehaviorSubject<User>(user);
    aaiSpy.getUser.and.returnValue(behaviourUser);
    const schema = {
      '$id': 'https://schema.dev.data.humancellatlas.org/type/project/15.0.0/project',
      '$schema': 'http://json-schema.org/draft-07/schema#',
      'additionalProperties': false,
      'description': 'A project entity contains information about the overall project.',
      'name': 'project',
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
              'describedBy': {
                'description': 'The URL reference to the schema.',
                'type': 'string',
                'pattern': '^(http|https)://schema.(.*?)humancellatlas.org/module/project/(([0-9]{1,}.[0-9]{1,}.[0-9]{1,})|([a-zA-Z]*?))/contact'
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
              },
              'email': {
                'description': 'Email address for the individual.',
                'type': 'string',
                'example': 'dummy@email.com',
                'format': 'email',
                'user_friendly': 'Email address'
              },
              'phone': {
                'description': 'Phone number of the individual or their lab.',
                'type': 'string',
                'example': '(+1) 234-555-6789',
                'guidelines': 'Include the country code.',
                'user_friendly': 'Phone number'
              },
              'institution': {
                'description': 'Name of primary institute where the individual works.',
                'type': 'string',
                'user_friendly': 'Institute',
                'example': 'EMBL-EBI; University of Washington'
              },
              'laboratory': {
                'description': 'Name of lab or department within the institute where the individual works.',
                'type': 'string',
                'user_friendly': 'Laboratory/Department',
                'example': 'Division of Vaccine Discovery; Department of Biology'
              },
              'address': {
                'description': 'Street address where the individual works.',
                'type': 'string',
                'example': '0000 Main Street, Nowheretown, MA, 12091',
                'guidelines': 'Include street name and number, city, country division, and postal code.',
                'user_friendly': 'Street address'
              },
              'country': {
                'description': 'Country where the individual works.',
                'type': 'string',
                'user_friendly': 'Country',
                'example': 'USA'
              },
              'corresponding_contributor': {
                'description': 'Whether the individual is a primary point of contact for the project.',
                'type': 'boolean',
                'user_friendly': 'Corresponding contributor',
                'example': 'Should be one of: yes, or no.'
              },
              'project_role': {
                '$schema': 'http://json-schema.org/draft-07/schema#',
                '$id': 'https://schema.dev.data.humancellatlas.org/module/ontology/1.0.0/contributor_role_ontology',
                'description': 'A term that describes the role of a contributor in the project.',
                'additionalProperties': false,
                'required': [
                  'text'
                ],
                'title': 'Contributor role ontology',
                'name': 'contributor_role_ontology',
                'type': 'object',
                'properties': {
                  'describedBy': {
                    'description': 'The URL reference to the schema.',
                    'pattern': '^(http|https)://schema.(.*?)humancellatlas.org/module/ontology/(([0-9]{1,}.[0-9]{1,}.[0-9]{1,})|([a-zA-Z]*?))/contributor_role_ontology',
                    'type': 'string'
                  },
                  'schema_version': {
                    'description': 'Version number in major.minor.patch format.',
                    'type': 'string',
                    'pattern': '^[0-9]{1,}.[0-9]{1,}.[0-9]{1,}$',
                    'example': '4.6.1'
                  },
                  'text': {
                    'description': 'The primary role of the contributor in the project.',
                    'type': 'string',
                    'example': 'principal investigator; experimental scientist',
                    'user_friendly': 'Contributor role'
                  },
                  'ontology': {
                    'description': 'An ontology term identifier in the form prefix:accession.',
                    'type': 'string',
                    'graph_restriction': {
                      'ontologies': [
                        'obo:efo'
                      ],
                      'classes': [
                        'EFO:0002012'
                      ],
                      'relations': [
                        'rdfs:subClassOf'
                      ],
                      'direct': false,
                      'include_self': false
                    },
                    'example': 'EFO:0009736; EFO:0009741',
                    'user_friendly': 'Contributor role ontology ID'
                  },
                  'ontology_label': {
                    'description': 'The preferred label for the ontology term referred to in the ontology field. This may differ from the user-supplied value in the text field.',
                    'type': 'string',
                    'example': 'principal investigator; experimental scientist',
                    'user_friendly': 'Contributor role ontology label'
                  }
                }
              },
              'orcid_id': {
                'description': 'The individual\'s ORCID ID linked to previous work.',
                'type': 'string',
                'example': '0000-1111-2222-3333',
                'user_friendly': 'ORCID ID'
              }
            }
          },
          'type': 'array',
          'user_friendly': 'Contributors'
        },
        'describedBy': {
          'description': 'The URL reference to the schema.',
          'pattern': '^(http|https)://schema.(.*?)humancellatlas.org/type/project/(([0-9]{1,}.[0-9]{1,}.[0-9]{1,})|([a-zA-Z]*?))/project',
          'type': 'string'
        }
      },
      'title': 'Project',
      'type': 'object'
    };

    fixture = TestBed.createComponent(ContactFieldGroupComponent);
    component = fixture.componentInstance;
    component.metadataForm = new MetadataForm('project', schema);
    component.contactKey = 'project.contributors';
    component.contactFieldList = [
      'project.contributors.email',
      'project.contributors.institution',
      'project.contributors.country',
      'project.contributors.project_role',
      'project.contributors.corresponding_contributor'
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(aaiSpy.getUser).toHaveBeenCalled();
    expect(component.contributorsControl['controls'][0]['controls']['email'].value).toEqual('mail');
    expect(component.contributorsControl['controls'][0]['controls']['name'].value).toEqual('Test,,User');
  });
});
