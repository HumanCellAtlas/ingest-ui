import {TemplateGeneratorService} from './template-generator.service';
import {HttpClient} from '@angular/common/http';
import {BrokerService} from '../shared/services/broker.service';

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
});
