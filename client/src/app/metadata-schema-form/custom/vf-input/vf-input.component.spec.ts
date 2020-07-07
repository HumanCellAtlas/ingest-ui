import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VfInputComponent } from './vf-input.component';

describe('VfInputFieldComponent', () => {
  let component: VfInputComponent;
  let fixture: ComponentFixture<VfInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VfInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VfInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
