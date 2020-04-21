import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataFieldComponent } from './metadata-field.component';

describe('MetadataFieldComponent', () => {
  let component: MetadataFieldComponent;
  let fixture: ComponentFixture<MetadataFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadataFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
