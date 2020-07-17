import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorGroupComponent } from './donor-group.component';

describe('SpecimenGroupComponent', () => {
  let component: DonorGroupComponent;
  let fixture: ComponentFixture<DonorGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonorGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
