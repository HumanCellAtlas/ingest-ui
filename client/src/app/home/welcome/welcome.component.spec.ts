import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import {NewSubmissionComponent} from "../new-submission/new-submission.component";
import {IngestService} from "../../shared/services/ingest.service";
import {AuthService} from "../../auth/auth.service";

import {RouterTestingModule} from "@angular/router/testing";
import {NO_ERRORS_SCHEMA} from "@angular/core";


describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let mockAuthSvc: jasmine.SpyObj<AuthService>;
  let mockIngestSvc: jasmine.SpyObj<IngestService>;

  beforeEach(async(() => {
    mockAuthSvc = jasmine.createSpyObj(['handleAuthentication', 'isAuthenticated', 'getUserInfo']);
    mockIngestSvc = jasmine.createSpyObj(['getUserSummary']);
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [
        WelcomeComponent,
        NewSubmissionComponent,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthSvc},
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
