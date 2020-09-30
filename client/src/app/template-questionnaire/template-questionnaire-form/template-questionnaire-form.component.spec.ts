import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TemplateQuestionnaireFormComponent} from './template-questionnaire-form.component';
import {Router} from '@angular/router';
import {TemplateGeneratorService} from '../template-generator.service';
import {LoaderService} from '../../shared/services/loader.service';
import {AlertService} from '../../shared/services/alert.service';
import {DatePipe} from '@angular/common';

describe('TemplateQuestionnaireComponent', () => {
  let component: TemplateQuestionnaireFormComponent;
  let fixture: ComponentFixture<TemplateQuestionnaireFormComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTemplateGeneratorSvc: jasmine.SpyObj<TemplateGeneratorService>;
  let mockLoaderService: jasmine.SpyObj<LoaderService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockDatePipe: jasmine.SpyObj<DatePipe>;

  beforeEach(async(() => {
    mockRouter = jasmine.createSpyObj(['navigate']);
    mockTemplateGeneratorSvc = jasmine.createSpyObj(['generate']);
    mockLoaderService = jasmine.createSpyObj(['display']);
    mockAlertService = jasmine.createSpyObj(['error', 'success']);
    mockDatePipe = jasmine.createSpyObj(['transform']);
    TestBed.configureTestingModule({
      declarations: [TemplateQuestionnaireFormComponent],
      providers: [
        {provide: TemplateGeneratorService, useValue: mockTemplateGeneratorSvc},
        {provide: LoaderService, useValue: mockLoaderService},
        {provide: AlertService, useValue: mockAlertService},
        {provide: Router, useValue: mockRouter},
        {provide: DatePipe, useValue: mockDatePipe},
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
