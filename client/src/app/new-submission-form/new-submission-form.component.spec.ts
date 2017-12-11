import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubmissionFormComponent } from './new-submission-form.component';

describe('NewSubmissionFormComponent', () => {
  let component: NewSubmissionFormComponent;
  let fixture: ComponentFixture<NewSubmissionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSubmissionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSubmissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
