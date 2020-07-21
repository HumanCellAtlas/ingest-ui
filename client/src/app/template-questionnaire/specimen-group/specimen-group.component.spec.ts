import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecimenGroupComponent } from './specimen-group.component';

describe('SpecimenGroupComponent', () => {
  let component: SpecimenGroupComponent;
  let fixture: ComponentFixture<SpecimenGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecimenGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecimenGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
