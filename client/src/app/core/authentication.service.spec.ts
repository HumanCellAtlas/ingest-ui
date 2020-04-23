import {AuthenticationService, DuplicateAccount} from "./authentication.service";
import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController, TestRequest} from "@angular/common/http/testing";
import {environment} from "../../environments/environment";
import {HttpErrorResponse} from "@angular/common/http";

let accountService: AuthenticationService;
let remoteService: HttpTestingController

function setUp() {
  TestBed.configureTestingModule({
    providers: [AuthenticationService],
    imports: [HttpClientTestingModule],
  });

  accountService = TestBed.get(AuthenticationService);
  remoteService = TestBed.get(HttpTestingController);
}

function expectAuthorisedRequest(token: string, httpMethod?: string): TestRequest {
  const request = remoteService.expectOne(req => req.url.startsWith(environment.INGEST_API_URL));
  const authorization = request.request.headers.get('Authorization');
  expect(authorization).toEqual(`Bearer ${token}`);
  if (httpMethod) {
    expect(request.request.method).toEqual(httpMethod);
  }
  return request;
};

describe('Get Account', () => {

  beforeEach(setUp);

  afterEach(() => {
    remoteService.verify();
  });

  it('should return an Account if the User is registered', (done) => {
    //expect:
    const accountId = 'c83bf90';
    const token = 'aGVsbG8sIHdvcmxkCg==';
    accountService.getAccount(token).then(account => {
      expect(account).toBeTruthy();
      expect(account.id).toEqual(accountId);
      expect(account.roles).toContain('CONTRIBUTOR');
    });

    //given:
    const request = expectAuthorisedRequest(token, 'GET');
    request.flush({
      'id': accountId,
      'roles': ['CONTRIBUTOR'],
    });

    //and:
    done();
  });

  it('should return empty object if the User is not registered', (done) => {
    //expect:
    const token = 'bWFnaWMgc3RyaW5nCg==';
    accountService.getAccount(token).then(account => {
      expect(account).toEqual({});
    });

    //given:
    const request = expectAuthorisedRequest(token, 'GET');
    request.flush(null, { status: 404, statusText: 'not found' });

    //and:
    done();
  });

});

describe('Account Registration', () => {

  beforeEach(setUp);

  afterEach(() => {
    remoteService.verify();
  });

  it('should return Account data after registration', (done) => {
    //expect:
    const accountId = '72f9001';
    const providerReference = '127ee11';
    const token = 'ZW5jb2RlZCBzdHJpbmcK';
    accountService.register(token).subscribe(account => {
      expect(account).toBeTruthy();
      expect(account.id).toEqual(accountId);
      expect(account.providerReference).toEqual(providerReference);
      expect(account.roles).toContain('CONTRIBUTOR');
    });

    //given:
    const request = expectAuthorisedRequest(token, 'POST');
    request.flush({
      'id': accountId,
      'providerReference': providerReference,
      'roles': ['CONTRIBUTOR'],
    })

    //and:
    done();
  });

  it('should throw an error when the User is already registered (403)', (done) => {
    testForError(DuplicateAccount, 403, 'Forbidden');
    done();
  });

  it('should throw an error when registration results in conflict (409)', (done) => {
    testForError(DuplicateAccount, 409, 'conflict');
    done();
  });

  it('should rethrow any other error', (done) => {
    testForError(Error, 400, 'client error',
      (error) => {
        expect(error.message).toContain('client error');
      });
    done();
  });

  function testForError(errorType, httpStatus: number, statusText?: string | 'error', postCondition?) {
    //expect:
    const token = 'dG9rZW4K';
    let sourceError;
    accountService.register(token).subscribe(
      (success) => {
        fail('Registration is expected to throw an error.');
      },
      (error) => {
        expect(error).toEqual(jasmine.any(errorType));
        sourceError = error;
      }
    );

    //given:
    const request = expectAuthorisedRequest(token, 'POST');
    request.flush(null, { status: httpStatus, statusText: statusText });

    //and:
    if (postCondition) {
      postCondition(sourceError);
    }
  }

});
