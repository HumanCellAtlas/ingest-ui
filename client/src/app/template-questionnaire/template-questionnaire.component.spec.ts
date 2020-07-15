import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateQuestionnaireComponent } from './template-questionnaire.component';

describe('TemplateQuestionnaireComponent', () => {
  let component: TemplateQuestionnaireComponent;
  let fixture: ComponentFixture<TemplateQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
