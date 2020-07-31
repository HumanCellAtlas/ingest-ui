import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TechnologyGroupComponent} from './technology-group.component';
import {FormControl} from '@angular/forms';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';

describe('TechnologyGroupComponent', () => {
  let component: TechnologyGroupComponent;
  let fixture: ComponentFixture<TechnologyGroupComponent>;
  let metadataFormSpy: jasmine.SpyObj<MetadataForm>;

  beforeEach(async(() => {
    const control = new FormControl();
    control.setValue([]);
    metadataFormSpy = jasmine.createSpyObj(['getControl', 'get']) as jasmine.SpyObj<MetadataForm>;
    metadataFormSpy.getControl.and.returnValue(control);

    TestBed.configureTestingModule({
      declarations: [TechnologyGroupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnologyGroupComponent);
    component = fixture.componentInstance;
    component.metadataForm = metadataFormSpy;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
