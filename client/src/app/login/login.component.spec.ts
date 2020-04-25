import {TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';
import {AaiService} from '../aai/aai.service';
import {AlertService} from "../shared/services/alert.service";
import {of} from "rxjs";
import {User} from "oidc-client";


describe('LoginComponent', () => {
  let loginFixture;
  let component: LoginComponent;
  let mockAaiSvc, mockRouterSvc, mockAlertSvc;
  let isAuthenticatedSpy: jasmine.Spy;

  beforeEach(() => {
    mockAaiSvc = jasmine.createSpyObj(['getUser', 'isUserLoggedIn', 'isUserLoggedInAndFromEBI', 'startAuthentication']);
    mockRouterSvc = jasmine.createSpyObj(['navigate']);
    mockAlertSvc = jasmine.createSpyObj(['error']);
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [{provide: AaiService, useValue: mockAaiSvc},
        {provide: Router, useValue: mockRouterSvc},
        {provide: AlertService, useValue: mockAlertSvc}],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });


  it('should create', () => {
    mockAaiSvc.isUserLoggedInAndFromEBI.and.returnValue(of(false));
    loginFixture = TestBed.createComponent(LoginComponent);
    component = loginFixture.componentInstance;
    expect(component).toBeTruthy();
  });

  describe('login method', function () {
    it('should redirect and authorise the user', () => {
      mockAaiSvc.isUserLoggedInAndFromEBI.and.returnValue(of(false));
      isAuthenticatedSpy = mockAaiSvc.isUserLoggedIn.and.returnValue(of(false));
      mockAaiSvc.getUser.and.returnValue(of(<User>{expired: false}));

      component = new LoginComponent(mockAaiSvc, mockRouterSvc, mockAlertSvc);
      component.login();

      expect(isAuthenticatedSpy).toHaveBeenCalledTimes(1);
      expect(mockAaiSvc.startAuthentication).toHaveBeenCalledTimes(1);
      expect(mockRouterSvc.navigate).toHaveBeenCalledTimes(0);
    });
  });

});
