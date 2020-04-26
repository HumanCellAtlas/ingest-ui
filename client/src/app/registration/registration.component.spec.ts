import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegistrationComponent} from './registration.component';
import {AuthenticationService} from "../core/authentication.service";
import {AaiService} from "../aai/aai.service";
import {User} from "oidc-client";
import {Observable} from "rxjs";
import {Account} from "../core/security.data";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

let registration: RegistrationComponent;
let fixture: ComponentFixture<RegistrationComponent>;

let authenticationService: SpyObj<AuthenticationService>;
let aaiService: SpyObj<AaiService>;

function configureTestEnvironment(): void {
  authenticationService = createSpyObj('AuthenticationService', ['register']);
  aaiService = createSpyObj('AaiService', ['getUser']);

  TestBed.configureTestingModule({
    declarations: [RegistrationComponent],
    providers: [
      {provide: AuthenticationService, useFactory: () => authenticationService},
      {provide: AaiService, useFactory: () => aaiService}
    ]
  })
}

function setUp(): void {
  fixture = TestBed.createComponent(RegistrationComponent);
  registration = fixture.componentInstance;
  fixture.detectChanges();
}

describe('Registration', () => {
  beforeEach(async(configureTestEnvironment));
  beforeEach(setUp);

  const accessToken = '78dea90';
  const user: User = <User>{access_token: accessToken};

  it('should register through the service if terms are accepted', async(() => {
    //given:
    aaiService.getUser.and.returnValue(Observable.of(user));
    registration.termsAccepted = true;

    //and:
    const newAccount = <Account>{id: '11f1faa8', providerReference: '2367ded12'};
    authenticationService.register.and.returnValue(Promise.resolve(newAccount));

    //when:
    registration.proceed();

    //then:
    expect(authenticationService.register).toHaveBeenCalledWith(accessToken);
    expect(registration.status.success).toBeTruthy();
  }));

  it('should NOT proceed if terms are not accepted', async(() => {
    //given:
    aaiService.getUser.and.returnValue(Observable.of(user));
    registration.termsAccepted = false;

    //when:
    registration.proceed();

    //then:
    expect(authenticationService.register).not.toHaveBeenCalled();
  }));
});
