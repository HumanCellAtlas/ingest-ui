import {Injectable} from '@angular/core';
import {TemplateSpecification} from './template-questionnaire.data';
import {HttpClient} from '@angular/common/http';
import {BrokerService} from '../shared/services/broker.service';
import {Observable} from 'rxjs';

export interface TemplateGenerationResponse {
  _links: TemplateGenerationLinks;
}

interface TemplateGenerationLinks {
  blob: TemplateGenerationHref;
}

interface TemplateGenerationHref {
  href: string;
}

@Injectable()
export class TemplateGeneratorService {

  constructor(readonly http: HttpClient, private brokerService: BrokerService) {
  }

  generate(templateSpec: TemplateSpecification): Observable<Blob> {
    return Observable
      .from(this.requestToGenerate(templateSpec))
      .flatMap(data =>
        Observable.interval(3000)
          .flatMap(() => this.getTemplate(data._links.blob.href))
          .filter(template => template.complete)
          .take(1)
          .map(template => template.data)
          .timeout(120000)
      );
  }

  requestToGenerate(templateSpec: TemplateSpecification): Observable<TemplateGenerationResponse> {
    const param = {
      'types': [{
        'schemaName': 'project',
        'includeModules': 'ALL',
        'embedProcess': false,
        'linkSpec': {
          'linkEntities': ['specimen_from_organism'],
          'linkProtocols': []
        }
      }, {
        'schemaName': 'imaged_specimen',
        'includeModules': 'ALL',
        'embedProcess': true,
        'linkSpec': {
          'linkEntities': [],
          'linkProtocols': ['imaging_protocol']
        }
      }, {
        'schemaName': 'imaging_protocol',
        'includeModules': 'ALL',
        'embedProcess': false,
        'linkSpec': {}
      }, {
        'schemaName': 'specimen_from_organism',
        'includeModules': 'ALL',
        'embedProcess': true,
        'linkSpec': {
          'linkEntities': ['donor_organism'],
          'linkProtocols': []
        }
      }]
    };
    return this.brokerService.generateTemplate(param)
      .map(data => data as TemplateGenerationResponse);
  }

  getTemplate(url: string): Observable<{ complete: boolean, data: Blob | undefined }> {
    return this.brokerService.downloadTemplate(url)
      .map(response => {
        if (response.status === 202) {
          return {complete: false, data: undefined};
        } else {
          return {complete: false, data: response.body as Blob};
        }
      });
  }

}
