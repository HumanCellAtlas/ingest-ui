import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegistrationComponent} from './registration.component';
import {By} from "@angular/platform-browser";

let component: RegistrationComponent;
let fixture: ComponentFixture<RegistrationComponent>;

function configureTestEnvironment(): void {
  TestBed.configureTestingModule({
    declarations: [ RegistrationComponent ]
  }).compileComponents();
}

function setUp(): void {
  fixture = TestBed.createComponent(RegistrationComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
}

describe('Accept Terms', () => {
  beforeEach(async(configureTestEnvironment));
  beforeEach(setUp);

  it('can be toggled', () => {
    expect(component.termsAccepted).toBeFalsy();

    component.acceptTerms();
    expect(component.termsAccepted).toBeTruthy();

    component.acceptTerms();
    expect(component.termsAccepted).toBeFalsy();
  });
});
