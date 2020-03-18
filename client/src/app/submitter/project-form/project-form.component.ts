import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  projectSchema: any = {
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
        'user_friendly': 'Project label',
        'guidelines': 'Project label is a short label by which you refer to the project. It should have no spaces and should be fewer than 50 characters.'
      },
      'project_title': {
        'description': 'An official title for the project.',
        'type': 'string',
        'example': 'Study of single cells in the human body.',
        'user_friendly': 'Project title',
        'guidelines': 'Project title should be fewer than 30 words, such as a title of a grant proposal or a publication.'
      },
      'project_description': {
        'description': 'A longer description of the project which includes research goals and experimental approach.',
        'type': 'string',
        'user_friendly': 'Project description',
        'guidelines': 'Project description should be fewer than 300 words, such as an abstract from a grant application or publication.'
      }
    }
  };

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit($event) {
    console.log('submit');
  }
}
