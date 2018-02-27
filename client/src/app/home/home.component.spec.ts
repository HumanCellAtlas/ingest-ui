import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import {WelcomeComponent} from "./welcome/welcome.component";
import {SubmissionListComponent} from "./submission-list/submission-list.component";
import {NewSubmissionComponent} from "./new-submission/new-submission.component";
import {RouterModule} from "@angular/router";
import {APP_BASE_HREF} from "@angular/common";
import {AuthService} from "../auth/auth.service";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
      ],
      providers:[
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: AuthService, useValue: { handleAuthentication: () => {}, isAuthenticated: () => {} } },
      ],
      declarations: [
        HomeComponent,
        WelcomeComponent,
        SubmissionListComponent,
        NewSubmissionComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
