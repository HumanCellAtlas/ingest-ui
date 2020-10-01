import {OntologyService} from './ontology.service';
import {HttpClient} from '@angular/common/http';
import {JsonSchema} from '../../metadata-schema-form/models/json-schema';
import {Metadata} from '../../metadata-schema-form/models/metadata';
import {JsonSchemaProperty} from '../../metadata-schema-form/models/json-schema-property';
import {OlsHttpResponse} from "../models/ols";
import {of} from "rxjs";


describe('createSearchParams', () => {
  let service: OntologyService;
  let http: jasmine.SpyObj<HttpClient>;

  let schema: JsonSchema;
  let metadata: Metadata;
  let olsResponse: OlsHttpResponse;

  beforeEach(() => {
    http = jasmine.createSpyObj(['get']);
    service = new OntologyService(http);

    schema = {
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
    };

    metadata = new Metadata({
      schema: schema as JsonSchemaProperty,
      key: 'project_role',
      isRequired: false
    });

    const response = {
      'numFound': 1,
      'start': 0,
      'docs': [
        {
          'id': 'efo:class:http://www.ebi.ac.uk/efo/EFO_0009736',
          'iri': 'http://www.ebi.ac.uk/efo/EFO_0009736',
          'short_form': 'EFO_0009736',
          'obo_id': 'EFO:0009736',
          'label': 'principal investigator',
          'ontology_name': 'efo',
          'ontology_prefix': 'EFO',
          'type': 'class'
        }
      ]
    };
    olsResponse = {highlighting: [], response: response, responseHeader: undefined};

  });

  it('should return correct search params when given a schema', (done) => {
    // given
    http.get.and.returnValue(of(olsResponse));

    // when
    const output = service.createSearchParams(schema, 'text');

    // then

    output.subscribe(data => {
      expect(data).toEqual({
        groupField: 'iri',
        start: 0,
        ontology: 'efo',
        allChildrenOf: ['http://www.ebi.ac.uk/efo/EFO_0009736'],
        q: 'text',
        rows: 30
      });
    });

    done();
  });

  it('should return correct search params when schema is undefined', (done) => {
    // given

    // when
    const output = service.createSearchParams(undefined, undefined);

    // then
    output.subscribe(data => {
      expect(data).toEqual({
        groupField: 'iri',
        start: 0,
        ontology: 'efo',
        q: '*',
        rows: 30
      });
    });

    done();
  });


});
