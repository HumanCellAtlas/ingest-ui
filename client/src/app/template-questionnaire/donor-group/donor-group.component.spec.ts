import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DonorGroupComponent} from './donor-group.component';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';
import {FormControl} from '@angular/forms';

describe('DonorGroupComponent', () => {
  let component: DonorGroupComponent;
  let fixture: ComponentFixture<DonorGroupComponent>;
  let metadataFormSpy: jasmine.SpyObj<MetadataForm>;

  beforeEach(async(() => {
    const control = new FormControl();
    control.setValue([]);
    metadataFormSpy = jasmine.createSpyObj(['getControl', 'get']) as jasmine.SpyObj<MetadataForm>;
    metadataFormSpy.getControl.and.returnValue(control);

    TestBed.configureTestingModule({
      declarations: [DonorGroupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorGroupComponent);
    component = fixture.componentInstance;
    component.metadataForm = metadataFormSpy;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
