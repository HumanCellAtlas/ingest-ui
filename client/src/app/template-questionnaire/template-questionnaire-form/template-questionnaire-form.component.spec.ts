import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateQuestionnaireFormComponent } from './template-questionnaire-form.component';

describe('TemplateQuestionnaireComponent', () => {
  let component: TemplateQuestionnaireFormComponent;
  let fixture: ComponentFixture<TemplateQuestionnaireFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateQuestionnaireFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateQuestionnaireFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
