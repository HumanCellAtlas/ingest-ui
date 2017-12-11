import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {JwtModule} from '@auth0/angular-jwt';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {SharedModule} from './shared/shared.module';

import {IngestService} from './shared/ingest.service';
import {AuthService} from './auth/auth.service';

import {ROUTES} from './app.routes';

import {AppComponent} from './app.component';
import {SubmissionListComponent} from './home/submission-list/submission-list.component';
import {NavigationComponent} from './navigation/navigation.component';
import {WelcomeComponent} from './home/welcome/welcome.component';
import {NewSubmissionComponent} from './home/new-submission/new-submission.component';
import {CallbackComponent} from './callback/callback.component';
import {HomeComponent} from './home/home.component';
import {ProjectComponent} from './submission/project/project.component';
import {NewSubmissionFormComponent} from './new-submission-form/new-submission-form.component';
import {SubmissionComponent} from './submission/submission.component';
import {TabComponent} from './shared/tab/tab.component';
import {TabsComponent} from './shared/tabs/tabs.component';
import {FilesComponent} from './submission/files/files.component';
import {SamplesComponent} from './submission/samples/samples.component';
import {AssaysComponent} from './submission/assays/assays.component';
import {ProtocolsComponent} from './submission/protocols/protocols.component';
import {AnalysesComponent} from './submission/analyses/analyses.component';
import {BundlesComponent} from './submission/bundles/bundles.component';
import {NewProjectComponent} from './new-submission-form/new-project/new-project.component';
import {UploadInfoComponent} from './submission/files/upload-info/upload-info.component';
import {FileListComponent} from './submission/files/file-list/file-list.component';
import {TeamComponent} from './submission/team/team.component';
import {SubmitComponent} from './submission/submit/submit.component'


export function tokenGetter(): string {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    SubmissionListComponent,
    NavigationComponent,
    WelcomeComponent,
    NewSubmissionComponent,
    CallbackComponent,
    HomeComponent,
    ProjectComponent,
    NewSubmissionFormComponent,
    SubmissionComponent,
    TabComponent,
    TabsComponent,
    FilesComponent,
    SamplesComponent,
    AssaysComponent,
    ProtocolsComponent,
    AnalysesComponent,
    BundlesComponent,
    NewProjectComponent,
    UploadInfoComponent,
    FileListComponent,
    TeamComponent,
    SubmitComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    JwtModule.forRoot({
      config: {
        tokenGetter, whitelistedDomains: ['localhost:8080', 'api.ingest.integration.data.humancellatlas.org']
      }
    }),
    SharedModule
  ],
  providers: [IngestService, AuthService],
  bootstrap: [AppComponent]
})


export class AppModule {
}

