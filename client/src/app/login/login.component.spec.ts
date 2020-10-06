import {TestBed} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AaiService} from '../aai/aai.service';
import {AlertService} from '../shared/services/alert.service';


describe('LoginComponent', () => {
  let loginFixture;
  let component: LoginComponent;
  let mockAaiSvc, mockRouterSvc, mockAlertSvc, mockActivatedRoute;
  let isAuthenticatedSpy: jasmine.Spy;

  beforeEach(() => {
    mockAaiSvc = jasmine.createSpyObj('AaiService', ['userLoggedIn', 'startAuthentication']);
    mockRouterSvc = jasmine.createSpyObj(['navigateByUrl']);
    mockAlertSvc = jasmine.createSpyObj(['error']);

    const queryParamMap = jasmine.createSpyObj(['get']);
    mockActivatedRoute = {
      snapshot: {
        queryParamMap: queryParamMap
      }
    };

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        {provide: AaiService, useValue: mockAaiSvc},
        {provide: Router, useValue: mockRouterSvc},
        {provide: AlertService, useValue: mockAlertSvc},
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });


  it('should create', () => {
    mockAaiSvc.userLoggedIn.and.returnValue(false);
    loginFixture = TestBed.createComponent(LoginComponent);
    component = loginFixture.componentInstance;
    expect(component).toBeTruthy();
  });

  describe('login method', function () {
    it('should redirect and authorise the user', () => {
      isAuthenticatedSpy = mockAaiSvc.userLoggedIn.and.returnValue(false);

      component = new LoginComponent(mockAaiSvc, mockRouterSvc, mockActivatedRoute);
      component.login();

      expect(isAuthenticatedSpy).toHaveBeenCalledTimes(2);
      expect(mockAaiSvc.startAuthentication).toHaveBeenCalledTimes(1);
      expect(mockRouterSvc.navigateByUrl).toHaveBeenCalledTimes(0);
    });

    it('should redirect to home when no given url', () => {
      isAuthenticatedSpy = mockAaiSvc.userLoggedIn.and.returnValue(true);

      const queryParamMap = jasmine.createSpyObj(['get']);
      queryParamMap.get.and.returnValue('');
      mockActivatedRoute = {
        snapshot: {
          queryParamMap: queryParamMap
        }
      };

      component = new LoginComponent(mockAaiSvc, mockRouterSvc, mockActivatedRoute);
      component.login();

      expect(isAuthenticatedSpy).toHaveBeenCalledTimes(2);
      expect(mockAaiSvc.startAuthentication).toHaveBeenCalledTimes(0);
      expect(mockRouterSvc.navigateByUrl).toHaveBeenCalledWith('/home');
    });

    it('should redirect to given url', () => {
      isAuthenticatedSpy = mockAaiSvc.userLoggedIn.and.returnValue(true);

      const queryParamMap = jasmine.createSpyObj(['get']);
      queryParamMap.get.and.returnValue('/redirect_url');
      mockActivatedRoute = {
        snapshot: {
          queryParamMap: queryParamMap
        }
      };

      component = new LoginComponent(mockAaiSvc, mockRouterSvc, mockActivatedRoute);
      component.login();

      expect(isAuthenticatedSpy).toHaveBeenCalledTimes(2);
      expect(mockAaiSvc.startAuthentication).toHaveBeenCalledTimes(0);
      expect(mockRouterSvc.navigateByUrl).toHaveBeenCalledWith('/redirect_url');
    });
  });
});
