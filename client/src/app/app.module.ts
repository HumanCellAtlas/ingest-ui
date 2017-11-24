import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {JwtModule} from '@auth0/angular-jwt';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {IngestService} from './ingest.service';
import {AuthService} from './auth/auth.service';

import {ROUTES} from './app.routes';

import {AppComponent} from './app.component';
import {SubmissionComponent} from './submission/submission.component';
import {NavigationComponent} from './navigation/navigation.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {NewSubmissionComponent} from './new-submission/new-submission.component';
import {CallbackComponent} from './callback/callback.component';
import {HomeComponent} from './home/home.component';

export function tokenGetter(): string { return localStorage.getItem('access_token'); }

@NgModule({
  declarations: [
    AppComponent,
    SubmissionComponent,
    NavigationComponent,
    WelcomeComponent,
    NewSubmissionComponent,
    CallbackComponent,
    HomeComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    JwtModule.forRoot({
      config: { tokenGetter, whitelistedDomains: ['localhost:8080']
      }
    })
  ],
  providers: [IngestService, AuthService],
  bootstrap: [AppComponent]
})



export class AppModule {
}

