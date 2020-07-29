import { TestBed } from '@angular/core/testing';

import { TemplateGeneratorService } from './template-generator.service';

describe('TemplateGeneratorService', () => {
  let service: TemplateGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
