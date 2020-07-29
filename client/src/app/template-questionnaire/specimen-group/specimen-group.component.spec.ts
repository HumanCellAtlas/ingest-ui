import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpecimenGroupComponent} from './specimen-group.component';
import {FormControl} from '@angular/forms';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';

describe('SpecimenGroupComponent', () => {
  let component: SpecimenGroupComponent;
  let fixture: ComponentFixture<SpecimenGroupComponent>;
  let metadataFormSpy: jasmine.SpyObj<MetadataForm>;

  beforeEach(async(() => {
    const control = new FormControl();
    control.setValue([]);
    metadataFormSpy = jasmine.createSpyObj(['getControl', 'get']) as jasmine.SpyObj<MetadataForm>;
    metadataFormSpy.getControl.and.returnValue(control);

    TestBed.configureTestingModule({
      declarations: [SpecimenGroupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecimenGroupComponent);
    component = fixture.componentInstance;
    component.metadataForm = metadataFormSpy;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
