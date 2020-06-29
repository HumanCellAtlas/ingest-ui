import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRegistrationFormComponent } from './project-registration-form.component';

describe('ProjectRegistrationFormComponent', () => {
  let component: ProjectRegistrationFormComponent;
  let fixture: ComponentFixture<ProjectRegistrationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectRegistrationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
