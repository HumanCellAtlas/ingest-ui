import {AaiService} from "./aai.service";
import {async, fakeAsync, TestBed} from "@angular/core/testing";
import {AuthenticationService} from "../core/authentication.service";
import {User, UserManager} from "oidc-client";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AlertService} from "../shared/services/alert.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {Account} from "../core/security.data";
import SpyObj = jasmine.SpyObj;

describe('Complete Authentication', () =>{

  let aaiService: AaiService;

  let authenticationService: SpyObj<AuthenticationService>;
  let userManager: SpyObj<UserManager>;
  let alertService: SpyObj<AlertService>;
  let router: SpyObj<Router>;

  const user: User = {
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
  }

  beforeEach(() => {
    authenticationService = jasmine.createSpyObj('AuthenticationService', ['getAccount']);
    userManager = jasmine.createSpyObj('UserManager', ['getUser', 'signinRedirectCallback'])
    alertService = jasmine.createSpyObj('AlertService', ['error']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AaiService,
        {provide: AuthenticationService, useFactory: () => authenticationService},
        {provide: UserManager, useFactory: () => userManager},
        {provide: AlertService, useValue: alertService},
        {provide: Router, useFactory: () => router},
      ],
      imports: [HttpClientTestingModule],
    });

    aaiService = TestBed.get(AaiService);
  });

  it('should redirect home when the user is registered', async(() => {
    //given:
    signInToRemoteService();

    //and:
    authenticationService.getAccount.and.returnValue(Observable.of(<Account>{}).toPromise());

    //expect:
    aaiService.completeAuthentication().then(() => {
      expect(authenticationService.getAccount).toHaveBeenCalledWith(user.access_token);
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      expect(aaiService.user$.getValue()).toBe(user);
    });
  }));

  it('should redirect to registration page when User has not registered yet', async(() => {
    //given:
    signInToRemoteService();

    //and:
    authenticationService.getAccount.and.returnValue(Promise.reject());

    //expect:
    aaiService.completeAuthentication().then(() => {
      expect(authenticationService.getAccount).toHaveBeenCalledWith(user.access_token);
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/registration']);
      expect(aaiService.user$.getValue()).toBe(user);
    });
  }));

  function signInToRemoteService() {
    userManager.getUser.and.returnValue(Observable.of(user).toPromise());
    userManager.signinRedirectCallback.and.returnValue(Observable.of(user).toPromise());
  }

});
