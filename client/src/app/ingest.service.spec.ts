import { TestBed, inject } from '@angular/core/testing';

import { IngestService } from './ingest.service';

describe('IngestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IngestService]
    });
  });

  it('should be created', inject([IngestService], (service: IngestService) => {
    expect(service).toBeTruthy();
  }));
});
