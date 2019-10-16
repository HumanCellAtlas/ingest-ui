import {AuthService} from './auth.service';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {of} from "rxjs";

describe('AuthService', () => {

  let mockRouter: jasmine.SpyObj<Router>;
  let mockHttp: jasmine.SpyObj<HttpClient>;
  let authSvc: AuthService

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj(['navigate']);
    mockHttp = jasmine.createSpyObj(['get']);
    mockHttp.get.and.returnValue(of({}))
    authSvc = new AuthService(mockRouter, mockHttp);

    authSvc.config = {
      domain: 'domain',
      callbackUrl: '/cb',
      apiUrl: ''
    }
    authSvc.openIdConfig = {
      authorization_endpoint: '/authorize'
    }

  });

  describe('buildSearchParams', () => {
    it('should convert obj to search params', () => {
      const obj: object = {
        'key': 'value',
        'key2': 'value2'
      };
      const out = authSvc.buildSearchParams(obj);
      expect(out).toEqual('key=value&key2=value2');
    })
  });

  describe('authorize', () => {
    it('should redirect to authorize endpoint with correct params', () => {
      authSvc.redirect = jasmine.createSpy();
      authSvc.authorize();
      expect(authSvc.redirect).toHaveBeenCalledWith('/authorize?redirect_uri=%2Fcb');
    })
  });

  describe('authorizeSilently', () => {
    it('should call runIframe with authorize url and domain url', () => {
      authSvc.redirect = jasmine.createSpy();
      authSvc.runIframe = jasmine.createSpy().and.returnValue(of({'k': 'v'}).toPromise());
      authSvc.setSession = jasmine.createSpy();

      authSvc.authorizeSilently();
      expect(authSvc.runIframe).toHaveBeenCalledWith('/authorize?scope=openid+profile+read%3Aprofile+email&redirect_uri=%2Fcb&prompt=none', 'https://domain');
    });
  });

});
