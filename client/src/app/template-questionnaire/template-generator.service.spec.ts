import {TemplateGeneratorService} from './template-generator.service';
import {HttpClient} from '@angular/common/http';

describe('TemplateGeneratorService', () => {
  let service: TemplateGeneratorService;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj(['get']);
    service = new TemplateGeneratorService(mockHttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
