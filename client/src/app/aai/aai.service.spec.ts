import {AaiService} from './aai.service';
import {async, TestBed} from '@angular/core/testing';
import {RegistrationService} from '../core/registration.service';
import {User, UserManager} from 'oidc-client';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AlertService} from '../shared/services/alert.service';
import {Observable} from 'rxjs';
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

    aaiService = TestBed.get(AaiService);
  });

  it('should redirect home when the user is registered', async(() => {
    // given:
    signInToRemoteService();

    // and:
    ingestSvc.getUserAccount.and.returnValue(Observable.of(new Account({
      id: '',
      providerReference: '',
      roles: []
    })));

    // expect:
    aaiService.completeAuthentication().then(() => {
      expect(ingestSvc.getUserAccount).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
      expect(aaiService.user$.getValue()).toBe(user);
    });
  }));

  it('should redirect to url when the user is registered', async(() => {
    // given:
    signInToRemoteService();
    user.state = '/redirect_url';

    // and:
    ingestSvc.getUserAccount.and.returnValue(Observable.of(new Account({
      id: '',
      providerReference: '',
      roles: []
    })));

    // expect:
    aaiService.completeAuthentication().then(() => {
      expect(ingestSvc.getUserAccount).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/redirect_url');
      expect(aaiService.user$.getValue()).toBe(user);
    });
  }));

  it('should redirect to registration page when User has not registered yet', async(() => {
    // given:
    signInToRemoteService();

    // and:
    ingestSvc.getUserAccount.and.returnValue(Observable.throwError(new HttpErrorResponse({status: 404})));

    // expect:
    aaiService.completeAuthentication().then(() => {
      expect(ingestSvc.getUserAccount).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/registration']);
      expect(aaiService.user$.getValue()).toBe(user);
    });
  }));

  it('should display error and reset user when it could not communicate successfully with Ingest API', async(() => {
    // given:
    signInToRemoteService();

    // and:
    ingestSvc.getUserAccount.and.returnValue(Observable.throwError(new HttpErrorResponse({status: 0})));

    // and:
    userManager.removeUser.and.returnValue(Observable.of(undefined).toPromise());

    // expect:
    aaiService.completeAuthentication().then(() => {
      expect(ingestSvc.getUserAccount).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledTimes(0);
      expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
      expect(alertService.error).toHaveBeenCalledTimes(1);
      expect(userManager.removeUser).toHaveBeenCalledTimes(1);
      expect(aaiService.user$.getValue()).toBeFalsy();
    });
  }));

  function signInToRemoteService() {
    userManager.getUser.and.returnValue(Observable.of(user).toPromise());
    userManager.signinRedirectCallback.and.returnValue(Observable.of(user).toPromise());
  }

});
