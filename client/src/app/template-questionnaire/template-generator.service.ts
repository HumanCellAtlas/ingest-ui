import {Injectable} from '@angular/core';
import {TemplateSpecification, TypeSpec} from './template-questionnaire.data';
import {HttpClient} from '@angular/common/http';
import {BrokerService} from '../shared/services/broker.service';
import {Observable, throwError} from 'rxjs';

export interface TemplateGenerationRequestParam {
  filename: string;
  spec: TemplateGenerationSpec;
}

export interface TemplateGenerationSpec {
  types: TypeSpec[];
}

export interface TemplateGenerationResponse {
  _links: TemplateGenerationLinks;
}

interface TemplateGenerationLinks {
  download: TemplateGenerationHref;
}

interface TemplateGenerationHref {
  href: string;
}

@Injectable()
export class TemplateGeneratorService {

  POLLING_INTERVAL = 3000; // 3 secs
  TIMEOUT = 300000; // 5 mins

  constructor(readonly http: HttpClient, private brokerService: BrokerService) {
  }

  generateTemplate(templateSpec: TemplateSpecification): Observable<Blob> {
    return Observable
      .from(this._requestToGenerate(templateSpec))
      .flatMap(data =>
        Observable.interval(this.POLLING_INTERVAL)
          .flatMap(() => this._requestToDownload(data._links.download.href))
          .filter(template => template.complete)
          .take(1)
          .map(template => template.data)
          .timeoutWith(this.TIMEOUT,
            throwError(new Error('Retrieval of template spreadsheet has timed out.'))
          ));
  }

  private _requestToDownload(url: string): Observable<{ complete: boolean, data: Blob | undefined }> {
    return this.brokerService.downloadTemplate(url)
      .map(response => {
        if (response.status === 200) {
          return {complete: true, data: response.body as Blob};
        } else {
          return {complete: false, data: undefined};
        }
      });
  }

  private _requestToGenerate(templateSpec: TemplateSpecification): Observable<TemplateGenerationResponse> {
    const param = {
      'filename': 'template.xlsx',
      'spec': {
        'types': templateSpec.getTypes()
      }
    };
    // TODO Remove after successful integration
    // const param = {
    //   'filename': 'template.xlsx',
    //   'spec': {
    //     'types': [{
    //       'schemaName': 'project',
    //       'includeModules': 'ALL',
    //       'embedProcess': false,
    //       'linkSpec': {
    //         'linkEntities': ['specimen_from_organism'],
    //         'linkProtocols': []
    //       }
    //     },
    //       {
    //         'schemaName': 'donor_organism',
    //         'includeModules': 'ALL',
    //         'embedProcess': false,
    //       }, {
    //         'schemaName': 'imaged_specimen',
    //         'includeModules': 'ALL',
    //         'embedProcess': true,
    //         'linkSpec': {
    //           'linkEntities': [],
    //           'linkProtocols': ['imaging_protocol']
    //         }
    //       }, {
    //         'schemaName': 'imaging_protocol',
    //         'includeModules': 'ALL',
    //         'embedProcess': false,
    //         'linkSpec': {}
    //       }, {
    //         'schemaName': 'specimen_from_organism',
    //         'includeModules': 'ALL',
    //         'embedProcess': true,
    //         'linkSpec': {
    //           'linkEntities': ['donor_organism'],
    //           'linkProtocols': []
    //         }
    //       }]
    //   }
    // };
    return this.brokerService.generateTemplate(param as TemplateGenerationRequestParam)
      .map(data => data as TemplateGenerationResponse);
  }

}
