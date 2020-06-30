import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactNameFieldComponent } from './contact-name-field.component';

describe('ContactNameFieldComponent', () => {
  let component: ContactNameFieldComponent;
  let fixture: ComponentFixture<ContactNameFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactNameFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactNameFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
