import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {Router} from "@angular/router";
import * as auth0 from 'auth0-js';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService},
        { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); }}
      ]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    spyOn(auth0, 'WebAuth').and.returnValue({ authorize : () => {}, parseHash: ()=>{}});
    expect(service).toBeTruthy();
  }));
});
