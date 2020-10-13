import {AaiService} from './aai.service';
import {TestBed} from '@angular/core/testing';
import {User, UserManager} from 'oidc-client';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AlertService} from '../shared/services/alert.service';
import {of, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {Account} from '../core/account';
import {HttpErrorResponse} from '@angular/common/http';
import {IngestService} from '../shared/services/ingest.service';
import SpyObj = jasmine.SpyObj;

describe('Complete Authentication', () => {

  let aaiService: AaiService;

  let ingestSvc: SpyObj<IngestService>;
  let userManager: SpyObj<UserManager>;
  let alertService: SpyObj<AlertService>;
  let router: SpyObj<Router>;

  let user: User;

  beforeEach(() => {
    user = {
      access_token: '98cbcb1',
      id_token: '3762dd9',
      expired: false,
      expires_at: 0,
      expires_in: 0,
      profile: undefined,
      scope: 'profile',
      scopes: [],
      state: undefined,
      token_type: 'access',
      toStorageString: () => '',
    };
    ingestSvc = jasmine.createSpyObj('IngestService', ['getUserAccount']);
    userManager = jasmine.createSpyObj('UserManager', ['getUser', 'signinRedirectCallback', 'removeUser']);
    alertService = jasmine.createSpyObj('AlertService', ['error']);
    router = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        AaiService,
        {provide: IngestService, useFactory: () => ingestSvc},
        {provide: UserManager, useFactory: () => userManager},
        {provide: AlertService, useValue: alertService},
        {provide: Router, useFactory: () => router},
      ],
      imports: [HttpClientTestingModule],
    });

    aaiService = TestBed.inject(AaiService);
  });

  it('should redirect home when the user is registered', (done) => {
    // given:
    signInToRemoteService();

    // and:
    ingestSvc.getUserAccount.and.returnValue(of(new Account({
      id: '',
      providerReference: '',
      roles: []
    })));

    // expect:
    aaiService.completeAuthentication().then(() => {
      expect(ingestSvc.getUserAccount).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
      aaiService.getUser().subscribe(usr => {
        expect(usr).toBe(user);
        done();
      });
    });
  });

  it('should redirect to url when the user is registered', (done) => {
    // given:
    signInToRemoteService();
    user.state = '/redirect_url';

    // and:
    ingestSvc.getUserAccount.and.returnValue(of(new Account({
      id: '',
      providerReference: '',
      roles: []
    })));

    // expect:
    aaiService.completeAuthentication().then(() => {
      expect(ingestSvc.getUserAccount).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/redirect_url');
      aaiService.getUser().subscribe(usr => {
        expect(usr).toBe(user);
        done();
      });
    });
  });

  it('should redirect to registration page when User has not registered yet', (done) => {
    // given:
    signInToRemoteService();

    // and:
    ingestSvc.getUserAccount.and.returnValue(throwError(new HttpErrorResponse({status: 404})));

    // expect:
    aaiService.completeAuthentication().then(() => {
      expect(ingestSvc.getUserAccount).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/registration']);
      aaiService.getUser().subscribe(usr => {
        expect(usr).toBe(user);
        done();
      });
    });
  });

  it('should display error and reset user when it could not communicate successfully with Ingest API', (done) => {
    // given:
    signInToRemoteService();

    // and:
    ingestSvc.getUserAccount.and.returnValue(throwError(new HttpErrorResponse({status: 0})));

    // and:
    userManager.removeUser.and.returnValue(of(undefined).toPromise());

    // expect:
    aaiService.completeAuthentication().then(() => {
      expect(ingestSvc.getUserAccount).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledTimes(0);
      expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
      expect(alertService.error).toHaveBeenCalledTimes(1);
      expect(userManager.removeUser).toHaveBeenCalledTimes(1);
      aaiService.getUser().subscribe(usr => {
        expect(usr).toBe(undefined);
        done();
      });
    });
  });

  function signInToRemoteService() {
    userManager.getUser.and.returnValue(of(user).toPromise());
    userManager.signinRedirectCallback.and.returnValue(of(user).toPromise());
  }

});
