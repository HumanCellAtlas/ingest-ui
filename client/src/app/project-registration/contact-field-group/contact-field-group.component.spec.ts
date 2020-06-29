import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFieldGroupComponent } from './contact-field-group.component';

describe('ContactFieldGroupComponent', () => {
  let component: ContactFieldGroupComponent;
  let fixture: ComponentFixture<ContactFieldGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactFieldGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFieldGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
