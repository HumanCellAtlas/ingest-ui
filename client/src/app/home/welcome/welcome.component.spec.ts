import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import {NewSubmissionComponent} from '../new-submission/new-submission.component';
import {IngestService} from '../../shared/services/ingest.service';

import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {AaiService} from '../../aai/aai.service';


describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let mockAaiSvc: jasmine.SpyObj<AaiService>;
  let mockIngestSvc: jasmine.SpyObj<IngestService>;

  beforeEach(async(() => {
    mockAaiSvc = jasmine.createSpyObj(['handleAuthentication', 'isAuthenticated', 'getUserInfo']);
    mockIngestSvc = jasmine.createSpyObj(['getUserSummary']);
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [
        WelcomeComponent,
        NewSubmissionComponent,
      ],
      providers: [
        { provide: AaiService, useValue: mockAaiSvc},
        { provide: IngestService, useValue: mockIngestSvc },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
