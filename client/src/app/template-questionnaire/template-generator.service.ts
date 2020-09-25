import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, from, interval, throwError} from 'rxjs';
import {filter, flatMap, map, take, timeoutWith} from 'rxjs/operators';
import {TemplateSpecification, TypeSpec} from './template-questionnaire.data';
import {BrokerService} from '../shared/services/broker.service';

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
    return from(this._requestToGenerate(templateSpec))
      .pipe(flatMap(data =>
        interval(this.POLLING_INTERVAL)
          .pipe(
            flatMap(() => this._requestToDownload(data._links.download.href)),
            filter(template => template.complete),
            take(1),
            map(template => template.data),
            timeoutWith(this.TIMEOUT, throwError(new Error('Retrieval of template spreadsheet has timed out.')))
          )
      ));
  }

  private _requestToDownload(url: string): Observable<{ complete: boolean, data: Blob | undefined }> {
    return this.brokerService.downloadTemplate(url)
      .pipe(map(response => response.status === 200 ?
        {complete: true, data: response.body as Blob} :
        {complete: false, data: undefined}
      ));
  }

  private _requestToGenerate(templateSpec: TemplateSpecification): Observable<TemplateGenerationResponse> {
    const param = {
      'filename': 'template.xlsx',
      'spec': {
        'types': templateSpec.getTypes()
      }
    };

    return this.brokerService
      .generateTemplate(param as TemplateGenerationRequestParam)
      .pipe(map(data => data as TemplateGenerationResponse));
  }

}
