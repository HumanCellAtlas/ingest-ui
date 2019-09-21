import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";


describe('LoginComponent', () => {
  let loginFixture;
  let component: LoginComponent;
  let mockAuthSvc, mockRouterSvc;

  beforeEach(() => {
    mockAuthSvc = jasmine.createSpyObj(['isAuthenticated']);
    mockRouterSvc = jasmine.createSpyObj(['navigate']);
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers:[{provide: AuthService, useValue: mockAuthSvc},
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

  it('should redirect to home when user is not authenticated', () => {
    mockAuthSvc.isAuthenticated.and.returnValue(true);
    loginFixture = TestBed.createComponent(LoginComponent);
    component = loginFixture.componentInstance;
    expect(mockRouterSvc.navigate).toHaveBeenCalledWith(['/home'])
  });
});
