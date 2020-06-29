import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessionFieldGroupComponent } from './accession-field-group.component';

describe('AccessionFieldGroupComponent', () => {
  let component: AccessionFieldGroupComponent;
  let fixture: ComponentFixture<AccessionFieldGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessionFieldGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessionFieldGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
