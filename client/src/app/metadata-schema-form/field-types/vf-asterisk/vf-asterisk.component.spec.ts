import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VfAsteriskComponent } from './vf-asterisk.component';

describe('VfAsteriskComponent', () => {
  let component: VfAsteriskComponent;
  let fixture: ComponentFixture<VfAsteriskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VfAsteriskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VfAsteriskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
