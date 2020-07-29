import {Injectable} from '@angular/core';
import {QuestionnaireData} from './template-questionnaire.data';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class TemplateGeneratorService {

  constructor(readonly http: HttpClient) {
  }

  generate(data: QuestionnaireData): Promise<Blob> {
    const url = './assets/xlsx-templates/Empty_template_v4.6.1_spreadsheet_NOPROJECTTAB.xlsx';
    return this.http.get(url, {responseType: 'blob'}).toPromise();
  }

}
