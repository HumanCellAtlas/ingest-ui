import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExperimentDetailGroupComponent} from './experiment-detail-group.component';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';
import {FormControl} from '@angular/forms';

describe('DonorGroupComponent', () => {
  let component: ExperimentDetailGroupComponent;
  let fixture: ComponentFixture<ExperimentDetailGroupComponent>;
  let metadataFormSpy: jasmine.SpyObj<MetadataForm>;

  beforeEach(async(() => {
    const control = new FormControl();
    control.setValue([]);
    metadataFormSpy = jasmine.createSpyObj(['getControl', 'get']) as jasmine.SpyObj<MetadataForm>;
    metadataFormSpy.getControl.and.returnValue(control);

    TestBed.configureTestingModule({
      declarations: [ExperimentDetailGroupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentDetailGroupComponent);
    component = fixture.componentInstance;
    component.metadataForm = metadataFormSpy;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
