import {TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";


describe('LoginComponent', () => {
  let loginFixture;
  let component: LoginComponent;
  let mockAuthSvc, mockRouterSvc;
  let authorizeSpy: jasmine.Spy;
  let authenticateSpy: jasmine.Spy;

  beforeEach(() => {
    mockAuthSvc = jasmine.createSpyObj(['isAuthenticated', 'authorize']);
    mockRouterSvc = jasmine.createSpyObj(['navigate']);
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [{provide: AuthService, useValue: mockAuthSvc},
        {provide: Router, useValue: mockRouterSvc}],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });


  it('should create', () => {
    mockAuthSvc.isAuthenticated.and.returnValue(false);
    loginFixture = TestBed.createComponent(LoginComponent);
    component = loginFixture.componentInstance;
    expect(component).toBeTruthy();
  });

  describe('login method', function () {
    it('should redirect to fusillade and authorise the user', () => {
      authenticateSpy = mockAuthSvc.isAuthenticated.and.returnValue(false);

      component = new LoginComponent(mockAuthSvc, mockRouterSvc)
      component.login();

      expect(authenticateSpy).toHaveBeenCalledTimes(1);
      expect(mockAuthSvc.authorize).toHaveBeenCalledTimes(1);
      expect(mockRouterSvc.navigate).toHaveBeenCalledTimes(0);
    });

    it('should navigate to home when user is authenticated', () => {
      authenticateSpy = mockAuthSvc.isAuthenticated.and.returnValue(true);
      authorizeSpy = mockAuthSvc.authorize;

      component = new LoginComponent(mockAuthSvc, mockRouterSvc)
      component.login();

      expect(authenticateSpy).toHaveBeenCalledTimes(1);
      expect(authorizeSpy).toHaveBeenCalledTimes(0);
      expect(mockRouterSvc.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

});
