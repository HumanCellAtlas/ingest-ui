import {AuthenticationService} from "./authentication.service";
import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController, TestRequest} from "@angular/common/http/testing";

describe('Get Account', () => {
  let service: AuthenticationService;
  let remoteService: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationService],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.get(AuthenticationService)
    remoteService = TestBed.get(HttpTestingController)
  })

  afterEach(() => {
    remoteService.verify();
  });

  it('should return an Account if the User is registered', (done) => {
    //expect:
    const accountId = 'c83bf90';
    const token = 'aGVsbG8sIHdvcmxkCg==';
    service.getAccount(token).subscribe(account => {
      expect(account).toBeTruthy();
      expect(account.id).toEqual(accountId);
      expect(account.roles).toContain('CONTRIBUTOR');
    });

    //given:
    const request = expectRemoteRequest(token, 'GET');
    request.flush({
      'id': accountId,
      'roles': [
        'CONTRIBUTOR'
      ],
    });

    //and:
    done();
  });

  it('should return empty object if the User is not registered', (done) => {
    //expect:
    const token = 'bWFnaWMgc3RyaW5nCg==';
    service.getAccount(token).subscribe(account => {
      expect(account).toEqual({});
    });

    //given:
    const request = expectRemoteRequest(token, 'GET');
    request.flush(null, { status: 404, statusText: 'not found' });

    //and:
    done();
  });

  function expectRemoteRequest(token: string, httpMethod?: string): TestRequest {
    const request = remoteService.expectOne(req => {
      let authorization = req.headers.get('Authorization');
      let hasCorrectAuthorization = authorization && authorization === `Bearer ${token}`;
      return req.url.startsWith('http') && hasCorrectAuthorization;
    });
    if (httpMethod) {
      expect(request.request.method).toEqual(httpMethod);
    }
    return request;
  };

})
