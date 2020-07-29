import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TemplateQuestionnaireFormComponent} from './template-questionnaire-form.component';
import {Router} from '@angular/router';
import {TemplateGeneratorService} from '../template-generator.service';

describe('TemplateQuestionnaireComponent', () => {
  let component: TemplateQuestionnaireFormComponent;
  let fixture: ComponentFixture<TemplateQuestionnaireFormComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTemplateGeneratorSvc: jasmine.SpyObj<TemplateGeneratorService>;

  beforeEach(async(() => {
    mockRouter = jasmine.createSpyObj(['navigate']);
    mockTemplateGeneratorSvc = jasmine.createSpyObj(['generate']);
    TestBed.configureTestingModule({
      declarations: [TemplateQuestionnaireFormComponent],
      providers: [
        {provide: TemplateGeneratorService, useValue: mockTemplateGeneratorSvc},
        {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();
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
