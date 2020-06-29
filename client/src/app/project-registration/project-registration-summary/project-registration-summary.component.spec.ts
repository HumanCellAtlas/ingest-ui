import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRegistrationSummaryComponent } from './project-registration-summary.component';

describe('ProjectRegistrationSummaryComponent', () => {
  let component: ProjectRegistrationSummaryComponent;
  let fixture: ComponentFixture<ProjectRegistrationSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectRegistrationSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRegistrationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
