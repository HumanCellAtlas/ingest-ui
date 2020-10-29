import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProcessDetailsComponent} from './process-details.component';
import {IngestService} from '../shared/services/ingest.service';
import SpyObj = jasmine.SpyObj;
import {of} from 'rxjs';

describe('ProcessDetailsComponent', () => {
  let component: ProcessDetailsComponent;
  let fixture: ComponentFixture<ProcessDetailsComponent>;

  let ingestSvc: SpyObj<IngestService>;

  beforeEach(async(() => {
    ingestSvc = jasmine.createSpyObj('IngestService', ['getAs']);
    ingestSvc.getAs.and.returnValue(of({_embedded: {biomaterials: [], files: [], protocols: []}}));
    TestBed.configureTestingModule({
      providers: [{provide: IngestService, useValue: ingestSvc}],
      declarations: [ProcessDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessDetailsComponent);
    component = fixture.componentInstance;
    component.processUrl = '/processes/id';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.processId).toBe('id');
  });
});
