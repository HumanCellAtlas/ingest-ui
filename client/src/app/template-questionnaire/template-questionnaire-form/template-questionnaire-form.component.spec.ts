import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TemplateQuestionnaireFormComponent} from './template-questionnaire-form.component';
import {Router} from '@angular/router';

describe('TemplateQuestionnaireComponent', () => {
  let component: TemplateQuestionnaireFormComponent;
  let fixture: ComponentFixture<TemplateQuestionnaireFormComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    mockRouter = jasmine.createSpyObj(['navigate']);
    TestBed.configureTestingModule({
      declarations: [TemplateQuestionnaireFormComponent],
      providers: [
        {provide: Router, useValue: mockRouter},
      ]
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
