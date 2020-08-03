import {TemplateGeneratorService} from './template-generator.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {BrokerService} from '../shared/services/broker.service';
import {of} from 'rxjs';
import {TemplateSpecification} from './template-questionnaire.data';
import {fakeAsync, tick} from '@angular/core/testing';
import {delay} from 'rxjs/operators';

describe('TemplateGeneratorService', () => {
  let service: TemplateGeneratorService;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;
  let mockBrokerService: jasmine.SpyObj<BrokerService>;

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj(['get']);
    mockBrokerService = jasmine.createSpyObj(['generateTemplate', 'downloadTemplate']);
    service = new TemplateGeneratorService(mockHttpClient, mockBrokerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateTemplate', () => {
    it('should generate spreadsheet after 5 secs', fakeAsync(() => {
      mockBrokerService.generateTemplate.and.returnValue(of({'_links': {'download': {'href': '/relative/url'}}}));

      const body = new Blob([],
        {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const response: HttpResponse<Blob> = new HttpResponse({body: body, status: 200});
      mockBrokerService.downloadTemplate.and.returnValue(of(response));

      const qData = {
        donorsRelated: '',
        experimentInfo: '',
        identifyingOrganisms: [],
        libraryPreparation: [],
        preNatalQuantity: '',
        protocols: [],
        specimenPurchased: '',
        specimenType: [],
        technologyType: []
      };

      const tSpec = TemplateSpecification.convert(qData);

      const blob = service.generateTemplate(tSpec);
      blob.subscribe(data => {
        console.log('blob', data);
        expect(data).toEqual(body);
      });

      tick(3000);  // fast forward 5 secs
    }));

    it('throws timeout error after 5 mins', fakeAsync(() => {
      mockBrokerService.generateTemplate.and.returnValue(of({'_links': {'download': {'href': '/relative/url'}}}));

      const body = new Blob([],
        {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const response: HttpResponse<Blob> = new HttpResponse({body: body, status: 200});
      mockBrokerService.downloadTemplate.and.returnValue(of(response)
        .pipe(delay(300000))); // delay result for 5 mins

      const qData = {
        donorsRelated: '',
        experimentInfo: '',
        identifyingOrganisms: [],
        libraryPreparation: [],
        preNatalQuantity: '',
        protocols: [],
        specimenPurchased: '',
        specimenType: [],
        technologyType: []
      };

      const tSpec = TemplateSpecification.convert(qData);

      const blob = service.generateTemplate(tSpec);

      blob.subscribe(data => {
        fail('should have thrown error');
      }, error => {
        expect(error instanceof Error).toBeTruthy();
        expect(error.message).toContain('Retrieval of template spreadsheet has timed out.');
      });

      tick(300000); // fast forward 5 mins

    }));
  });

});
