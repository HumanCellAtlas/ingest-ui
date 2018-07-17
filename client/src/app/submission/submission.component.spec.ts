import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmissionComponent } from './submission.component';
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {APP_BASE_HREF} from "@angular/common";
import {RouterTestingModule} from "@angular/router/testing";

describe('SubmissionComponent', () => {
  let component: SubmissionComponent;
  let fixture: ComponentFixture<SubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        // { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); }},
        { provide: APP_BASE_HREF, useValue: '/' },
        // { provide: ActivatedRoute}
      ],
      declarations: [
        SubmissionComponent,
        RouterTestingModule,
        // ActivatedRoute
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
