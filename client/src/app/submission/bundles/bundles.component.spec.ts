import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BundlesComponent } from './bundles.component';

describe('BundlesComponent', () => {
  let component: BundlesComponent;
  let fixture: ComponentFixture<BundlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BundlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
