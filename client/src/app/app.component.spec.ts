import { TestBed, async } from '@angular/core/testing';
import { RouterModule, Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import {LoaderService} from "./shared/services/loader.service";
import {NavigationComponent} from "./navigation/navigation.component";
import {AlertComponent} from "./shared/components/alert/alert.component";
import {AlertService} from "./shared/services/alert.service";


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: AuthService, useValue: { handleAuthentication: () => {}, isAuthenticated: () => {} } },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: LoaderService, useValue: {display: () => {} , status: { subscribe: () => {} }  }  },
        { provide: AlertService },
      ],
      declarations: [
        AppComponent,
        NavigationComponent,
        AlertComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
