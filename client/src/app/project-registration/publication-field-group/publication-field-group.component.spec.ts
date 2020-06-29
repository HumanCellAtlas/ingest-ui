import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationFieldGroupComponent } from './publication-field-group.component';

describe('PublicationFieldGroupComponent', () => {
  let component: PublicationFieldGroupComponent;
  let fixture: ComponentFixture<PublicationFieldGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicationFieldGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationFieldGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
