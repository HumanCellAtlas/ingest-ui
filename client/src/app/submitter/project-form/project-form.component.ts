import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  projectSchema: any =  {
    '$schema': 'http://json-schema.org/draft-07/schema#',
    '$id': 'https://schema.humancellatlas.org/type/project/14.1.0/project',
    'description': 'A project entity contains information about the overall project.',
    'additionalProperties': false,
    'required': [
      'describedBy',
      'schema_type',
      'project_core',
      'funders'
    ],
    'title': 'Project',
    'name': 'project',
    'type': 'object',
    'properties': {
      'describedBy': {
        'description': 'The URL reference to the schema.',
        'type': 'string',
        'pattern': '^(http|https)://schema.(.*?)humancellatlas.org/type/project/(([0-9]{1,}.[0-9]{1,}.[0-9]{1,})|([a-zA-Z]*?))/project'
      },
      'schema_version': {
        'description': 'The version number of the schema in major.minor.patch format.',
        'type': 'string',
        'pattern': '^[0-9]{1,}.[0-9]{1,}.[0-9]{1,}$',
        'example': '4.6.1'
      },
      'schema_type': {
        'description': 'The type of the metadata schema entity.',
        'type': 'string',
        'enum': [
          'project'
        ]
      },
      'provenance': {
        '$schema': 'http://json-schema.org/draft-07/schema#',
        '$id': 'https://schema.humancellatlas.org/system/1.1.0/provenance',
        'description': 'Provenance information added or generated at time of ingest.',
        'additionalProperties': false,
        'required': [
          'document_id',
          'submission_date'
        ],
        'title': 'Provenance',
        'name': 'provenance',
        'type': 'object',
        'properties': {
          'describedBy': {
            'description': 'The URL reference to the schema.',
            'type': 'string',
            'pattern': '^(http|https)://schema.(.*?)humancellatlas.org/system/(([0-9]{1,}.[0-9]{1,}.[0-9]{1,})|([a-zA-Z]*?))/provenance'
          },
          'schema_version': {
            'description': 'The version number of the schema in major.minor.patch format.',
            'type': 'string',
            'pattern': '^[0-9]{1,}.[0-9]{1,}.[0-9]{1,}$',
            'example': '4.6.1'
          },
          'schema_major_version': {
            'description': 'The major version number of the schema.',
            'type': 'integer',
            'pattern': '^[0-9]{1,}$',
            'title': 'Schema major version',
            'example': '4; 10'
          },
          'schema_minor_version': {
            'description': 'The minor version number of the schema.',
            'type': 'integer',
            'pattern': '^[0-9]{1,}$',
            'title': 'Schema minor version',
            'example': '6; 15'
          },
          'submission_date': {
            'description': 'When project was first submitted to database.',
            'type': 'string',
            'format': 'date-time',
            'title': 'Submission date'
          },
          'submitter_id': {
            'description': 'ID of individual who first submitted project.',
            'type': 'string',
            'title': 'Submitter ID'
          },
          'update_date': {
            'description': 'When project was last updated.',
            'type': 'string',
            'format': 'date-time',
            'title': 'Update date'
          },
          'updater_id': {
            'description': 'ID of individual who last updated project.',
            'type': 'string',
            'title': 'Updater ID'
          },
          'document_id': {
            'description': 'Identifier for document.',
            'type': 'string',
            'pattern': '.{8}-.{4}-.{4}-.{4}-.{12}',
            'comment': 'This structure supports the current ingest API. It may change in the future.',
            'title': 'Document ID'
          },
          'accession': {
            'description': 'A unique accession for this entity, provided by the broker.',
            'type': 'string',
            'title': 'Accession'
          }
        }
      },
      'project_core': {
        '$schema': 'http://json-schema.org/draft-07/schema#',
        '$id': 'https://schema.humancellatlas.org/core/project/7.0.5/project_core',
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
            'pattern': '^(http|https)://schema.(.*?)humancellatlas.org/core/project/(([0-9]{1,}.[0-9]{1,}.[0-9]{1,})|([a-zA-Z]*?))/project_core'
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
            'title': 'Project label',
            'guidelines': 'Project label is a short label by which you refer to the project. It should have no spaces and should be fewer than 50 characters.'
          },
          'project_title': {
            'description': 'An official title for the project.',
            'type': 'string',
            'example': 'Study of single cells in the human body.',
            'title': 'Project title',
            'guidelines': 'Project title should be fewer than 30 words, such as a title of a grant proposal or a publication.'
          },
          'project_description': {
            'description': 'A longer description of the project which includes research goals and experimental approach.',
            'type': 'string',
            'title': 'Project description',
            'guidelines': 'Project description should be fewer than 300 words, such as an abstract from a grant application or publication.'
          }
        }
      },
      'contributors': {
        'description': 'People contributing to any aspect of the project.',
        'type': 'array',
        'items': {
          '$schema': 'http://json-schema.org/draft-07/schema#',
          '$id': 'https://schema.humancellatlas.org/module/project/8.0.1/contact',
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
              'title': 'Contact name'
            },
            'email': {
              'description': 'Email address for the individual.',
              'type': 'string',
              'example': 'dummy@email.com',
              'format': 'email',
              'title': 'Email address'
            },
            'phone': {
              'description': 'Phone number of the individual or their lab.',
              'type': 'string',
              'example': '(+1) 234-555-6789',
              'guidelines': 'Include the country code.',
              'title': 'Phone number'
            },
            'institution': {
              'description': 'Name of primary institute where the individual works.',
              'type': 'string',
              'title': 'Institute',
              'example': 'EMBL-EBI; University of Washington'
            },
            'laboratory': {
              'description': 'Name of lab or department within the institute where the individual works.',
              'type': 'string',
              'title': 'Laboratory/Department',
              'example': 'Division of Vaccine Discovery; Department of Biology'
            },
            'address': {
              'description': 'Street address where the individual works.',
              'type': 'string',
              'example': '0000 Main Street, Nowheretown, MA, 12091',
              'guidelines': 'Include street name and number, city, country division, and postal code.',
              'title': 'Street address'
            },
            'country': {
              'description': 'Country where the individual works.',
              'type': 'string',
              'title': 'Country',
              'example': 'USA'
            },
            'corresponding_contributor': {
              'description': 'Whether the individual is a primary point of contact for the project.',
              'type': 'boolean',
              'title': 'Corresponding contributor',
              'example': 'Should be one of: yes, or no.'
            },
            'project_role': {
              '$schema': 'http://json-schema.org/draft-07/schema#',
              '$id': 'https://schema.humancellatlas.org/module/ontology/1.0.0/contributor_role_ontology',
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
                  'title': 'Contributor role'
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
                  'title': 'Contributor role ontology ID'
                },
                'ontology_label': {
                  'description': 'The preferred label for the ontology term referred to in the ontology field. This may differ from the user-supplied value in the text field.',
                  'type': 'string',
                  'example': 'principal investigator; experimental scientist',
                  'title': 'Contributor role ontology label'
                }
              }
            },
            'orcid_id': {
              'description': 'The individual\'s ORCID ID linked to previous work.',
              'type': 'string',
              'example': '0000-1111-2222-3333',
              'title': 'ORCID ID'
            }
          }
        },
        'title': 'Contributors'
      },
      'supplementary_links': {
        'description': 'External link(s) pointing to code, supplementary data files, or analysis files associated with the project which will not be uploaded.',
        'type': 'array',
        'example': 'https://github.com/czbiohub/tabula-muris; http://celltag.org/',
        'items': {
          'type': 'string'
        },
        'title': 'Supplementary link(s)'
      },
      'publications': {
        'description': 'Publications resulting from this project.',
        'type': 'array',
        'items': {
          '$schema': 'http://json-schema.org/draft-07/schema#',
          '$id': 'https://schema.humancellatlas.org/module/project/6.0.0/publication',
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
              'title': 'Authors',
              'guidelines': 'List each author in \'surname initials\' format.'
            },
            'title': {
              'description': 'The title of the publication.',
              'type': 'string',
              'title': 'Publication title',
              'example': 'Study of single cells in the human body.'
            },
            'doi': {
              'description': 'The publication digital object identifier (doi) of the publication.',
              'type': 'string',
              'example': '10.1016/j.cell.2016.07.054',
              'title': 'Publication DOI'
            },
            'pmid': {
              'description': 'The PubMed ID of the publication.',
              'type': 'integer',
              'example': '27565351',
              'title': 'Publication PMID'
            },
            'url': {
              'description': 'A URL for the publication.',
              'type': 'string',
              'title': 'Publication URL',
              'example': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5667944/'
            }
          }
        },
        'title': 'Publications'
      },
      'insdc_project_accessions': {
        'description': 'An International Nucleotide Sequence Database Collaboration (INSDC) project accession.',
        'type': 'array',
        'items': {
          'type': 'string',
          'pattern': '^[D|E|S]RP[0-9]+$'
        },
        'example': 'SRP000000',
        'title': 'INSDC project accession',
        'guidelines': 'Enter accession if project has been archived. Accession can be from the DDBJ, NCBI, or EMBL-EBI and must start with DRP, SRP, or ERP, respectively.'
      },
      'geo_series_accessions': {
        'description': 'A Gene Expression Omnibus (GEO) series accession.',
        'type': 'array',
        'items': {
          'type': 'string',
          'pattern': '^GSE.*$'
        },
        'example': 'GSE00000',
        'title': 'GEO series accession',
        'guidelines': 'Enter accession if project has been archived. Accession must start with GSE.'
      },
      'array_express_accessions': {
        'description': 'An ArrayExpress accession.',
        'type': 'array',
        'items': {
          'type': 'string',
          'pattern': '^E-....-.*$'
        },
        'example': 'E-AAAA-00',
        'title': 'ArrayExpress accession',
        'guidelines': 'Enter accession if project has been archived. Accession must start with E-.'
      },
      'insdc_study_accessions': {
        'description': 'An International Nucleotide Sequence Database Collaboration (INSDC) study accession.',
        'type': 'array',
        'items': {
          'type': 'string',
          'pattern': '^PRJ[E|N|D][a-zA-Z][0-9]+$'
        },
        'example': 'PRJNA000000',
        'title': 'INSDC study accession',
        'guidelines': 'Enter accession if study has been archived. Accession can be from the DDBJ, NCBI, or EMBL-EBI and must start with PRJD, PRJN, or PRJE, respectively.'
      },
      'biostudies_accessions': {
        'description': 'A BioStudies study accession.',
        'type': 'array',
        'items': {
          'type': 'string',
          'pattern': '^S-[A-Z]{4}[0-9]+$'
        },
        'example': 'S-EXMP1; S-HCAS33',
        'title': 'BioStudies accession',
        'guidelines': 'Enter accession if study has been archived.'
      },
      'funders': {
        'description': 'Funding source(s) supporting the project.',
        'type': 'array',
        'items': {
          '$schema': 'http://json-schema.org/draft-07/schema#',
          '$id': 'https://schema.humancellatlas.org/module/project/2.0.0/funder',
          'description': 'Information about the project funding source.',
          'additionalProperties': false,
          'required': [
            'grant_id',
            'organization'
          ],
          'title': 'Funder',
          'name': 'funder',
          'type': 'object',
          'properties': {
            'describedBy': {
              'description': 'The URL reference to the schema.',
              'type': 'string',
              'pattern': '^(http|https)://schema.(.*?)humancellatlas.org/module/project/(([0-9]{1,}.[0-9]{1,}.[0-9]{1,})|([a-zA-Z]*?))/funder'
            },
            'schema_version': {
              'description': 'The version number of the schema in major.minor.patch format.',
              'type': 'string',
              'pattern': '^[0-9]{1,}.[0-9]{1,}.[0-9]{1,}$',
              'example': '4.6.1'
            },
            'grant_title': {
              'description': 'The name of the grant funding the project.',
              'type': 'string',
              'example': 'Study of single cells in the human body.',
              'title': 'Grant title',
              'guidelines': 'Enter a title of approximately 30 words.'
            },
            'grant_id': {
              'description': 'The unique grant identifier or reference.',
              'type': 'string',
              'example': 'BB/P0000001/1',
              'title': 'Grant ID'
            },
            'organization': {
              'description': 'The name of the funding organization.',
              'type': 'string',
              'example': 'Biotechnology and Biological Sciences Research Council (BBSRC); California Institute of Regenerative Medicine (CIRM)',
              'title': 'Funding organization'
            }
          }
        },
        'title': 'Funding source(s)'
      }
    }
  };

  projectLayout: any = [
    {
      'type': 'tabs',
      'tabs': [
        {
          'title': 'Project',
          'items': [
            'project_core.project_title',
            'project_core.project_description',
            'project_core.project_short_name'
          ]
        },
        {
          'title': 'Contributors',
          'items': [
            {
              'type': 'help',
              'helpvalue': 'Hand Picked Contributor fields.'
            },
            {
              'key': 'contributors',
              'add': 'New',
              'style': {
                'add': 'btn-success'
              },
              'items': [
                'contributors[].name',
                'contributors[].email',
                'contributors[].phone',
                'contributors[].institution',
                'contributors[].laboratory',
                'contributors[].address',
                'contributors[].country',
                'contributors[].orcid_id',
                'contributors[].project_role.ontology',
                'contributors[].corresponding_contributor'
              ]
            }
          ]
        },
        {
          'title': 'Links',
          'items': [
            'supplementary_links',
            'biostudies_accessions',
            'array_express_accessions',
            'geo_series_accessions',
            'insdc_project_accessions',
            'insdc_study_accessions'
          ]
        },
        {
          'title': 'Submit',
          'items': [
            {
              'type': 'submit',
              'style': 'btn-info',
              'title': 'OK'
            }
          ]
        }
      ]
    }
    ];




  constructor() {
  }

  ngOnInit() {
  }

  onSubmit($event) {
    console.log('submit');
  }
}
