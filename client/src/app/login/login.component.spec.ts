import {TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';
import {AaiService} from '../aai/aai.service';
import {AlertService} from "../shared/services/alert.service";


describe('LoginComponent', () => {
  let loginFixture;
  let component: LoginComponent;
  let mockAaiSvc, mockRouterSvc, mockAlertSvc;
  let authorizeSpy: jasmine.Spy;
  let isAuthenticatedSpy: jasmine.Spy;
  let isUserFromEBISpy: jasmine.Spy;

  beforeEach(() => {
    mockAaiSvc = jasmine.createSpyObj(['isAuthenticated', 'isUserFromEBI', 'startAuthentication']);
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
    mockAaiSvc.isAuthenticated.and.returnValue(false);
    mockAaiSvc.isUserFromEBI.and.returnValue(false);
    loginFixture = TestBed.createComponent(LoginComponent);
    component = loginFixture.componentInstance;
    expect(component).toBeTruthy();
  });

  describe('login method', function () {
    it('should redirect and authorise the user', () => {
      isAuthenticatedSpy = mockAaiSvc.isAuthenticated.and.returnValue(false);
      isUserFromEBISpy = mockAaiSvc.isUserFromEBI.and.returnValue(false);

      component = new LoginComponent(mockAaiSvc, mockRouterSvc, mockAlertSvc);
      component.login();

      expect(isAuthenticatedSpy).toHaveBeenCalledTimes(2);
      expect(mockAaiSvc.startAuthentication).toHaveBeenCalledTimes(1);
      expect(mockRouterSvc.navigate).toHaveBeenCalledTimes(0);
    });

    it('should navigate to home when user is authenticated', () => {
      isAuthenticatedSpy = mockAaiSvc.isAuthenticated.and.returnValue(true);
      isUserFromEBISpy = mockAaiSvc.isUserFromEBI.and.returnValue(true);
      authorizeSpy = mockAaiSvc.startAuthentication;

      component = new LoginComponent(mockAaiSvc, mockRouterSvc, mockAlertSvc);
      component.login();

      expect(isAuthenticatedSpy).toHaveBeenCalledTimes(2);
      expect(authorizeSpy).toHaveBeenCalledTimes(0);
      expect(mockRouterSvc.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

});
