import {RegistrationService, RegistrationErrorCode, RegistrationFailed} from './registration.service';
import {fakeAsync, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {environment} from '../../environments/environment';
import {Account} from './account';

let accountService: RegistrationService;
let remoteService: HttpTestingController;

function setUp() {
  TestBed.configureTestingModule({
    providers: [RegistrationService],
    imports: [HttpClientTestingModule],
  });

  accountService = TestBed.get(RegistrationService);
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
}

describe('Account Registration', () => {

  beforeEach(setUp);

  afterEach(() => {
    remoteService.verify();
  });

  it('should return Account data after registration', fakeAsync(() => {
    // expect:
    const accountId = '72f9001';
    const providerReference = '127ee11';
    const token = 'ZW5jb2RlZCBzdHJpbmcK';
    accountService.register(token).then((account: Account) => {
      expect(account).toBeTruthy();
      expect(account.id).toEqual(accountId);
      expect(account.providerReference).toEqual(providerReference);
      expect(account.roles).toContain('CONTRIBUTOR');
    });

    // given:
    const request = expectAuthorisedRequest(token, 'POST');
    request.flush(<Account>{
      id: accountId,
      providerReference: providerReference,
      roles: ['CONTRIBUTOR'],
    });
  }));

  it('should throw an error when the User is already registered (403)', fakeAsync(() => {
    testForError(RegistrationErrorCode.Duplication, 403, 'Forbidden');
  }));

  it('should throw an error when registration results in conflict (409)', fakeAsync(() => {
    testForError(RegistrationErrorCode.Duplication, 409, 'conflict');
  }));

  it('should rethrow any other error', fakeAsync(() => {
    testForError(RegistrationErrorCode.ServiceError, 400, 'client error',
      (error) => {
        expect(error.message).toContain('client error');
      });
  }));

  function testForError(errorCode, httpStatus: number, statusText?: string | 'error', postCondition?) {
    // expect:
    const token = 'dG9rZW4K';
    accountService.register(token)
      .then(() => {
        fail('Registration is expected to throw an error.');
      })
      .catch((error: RegistrationFailed) => {
        expect(error.errorCode).toEqual(errorCode);
        if (postCondition) {
          postCondition(error);
        }
      });

    // given:
    const request = expectAuthorisedRequest(token, 'POST');
    request.flush(null, { status: httpStatus, statusText: statusText });
  }

});
