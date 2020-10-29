
import {IngestService} from './ingest.service';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule,
  HttpTestingController } from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';

describe('Ingest Service', () => {
  let service: IngestService;
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IngestService],
      imports: [HttpClientTestingModule]
    });


    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(IngestService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('query entity functions', () => {
    const makeTest = name => {
      it(`should work for ${name}`, () => {
        const mockList = {
          name: 'my random name'
        };

        const criteria = [{
          field: 'mockField',
          operator: 'AND',
          value: 'mockValue'
        }, {
          field: 'mockField2',
          operator: 'AND',
          value: 'mockValue2'
        }];

        const funcName = `query${name.charAt(0).toUpperCase()}${name.slice(1)}`;

        // TODO: Remove ts-ignore and mock returned ListResult properly
        // @ts-ignore
        service[funcName](criteria).subscribe(res => expect(res.name).toEqual('my random name'));

        const req = httpTestingController.expectOne(`http://localhost:8080/${name}/query`);
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(criteria);
        req.flush(mockList);
      });
    };

    ['files', 'protocols', 'biomaterials', 'processes', 'projects'].forEach(makeTest);
  });
});
