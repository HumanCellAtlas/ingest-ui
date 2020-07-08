import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {FlexLayoutModule} from '@angular/flex-layout';

import {NgxDatatableModule} from '@swimlane/ngx-datatable';

import {SharedModule} from './shared/shared.module';

import {IngestService} from './shared/services/ingest.service';
import {BrokerService} from './shared/services/broker.service';

import {ROUTES} from './app.routes';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {SubmissionListComponent} from './submission-list/submission-list.component';
import {NavigationComponent} from './navigation/navigation.component';
import {SubmissionComponent} from './submission/submission.component';
import {TabComponent} from './shared/components/tab/tab.component';
import {TabsComponent} from './shared/components/tabs/tabs.component';
import {FilesComponent} from './submission/files/files.component';
import {UploadInfoComponent} from './submission/files/upload-info/upload-info.component';
import {SubmitComponent} from './submission/submit/submit.component';

import {MetadataListComponent} from './submission/metadata-list/metadata-list.component';

import {ProjectComponent} from './project/project.component';
import {ProjectListComponent} from './shared/components/project-list/project-list.component';
import {AllProjectsComponent} from './all-projects/all-projects.component';
import {MyProjectsComponent} from './my-projects/my-projects.component';
import {ProjectFormComponent} from './project-form/project-form.component';

import {UploadComponent} from './shared/components/upload/upload.component';
import {LoginComponent} from './login/login.component';
import {ProjectViewComponent} from './shared/components/project-view/project-view.component';
import {AlertService} from './shared/services/alert.service';
import {AlertComponent} from './shared/components/alert/alert.component';
import {LoaderService} from './shared/services/loader.service';
import {FlattenService} from './shared/services/flatten.service';
import {SchemaService} from './shared/services/schema.service';

import {AaiCallbackComponent} from './aai-callback/aai-callback.component';
import {OidcInterceptor} from './aai/oidc-interceptor';
import {GlobalHeaderComponent} from './global-header/global-header.component';
import {AaiSecurity} from './aai/aai.module';
import {RegistrationComponent} from './registration/registration.component';
import {MetadataSchemaFormModule} from './metadata-schema-form/metadata-schema-form.module';
import {MaterialModule} from './material.module';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {ProjectRegistrationModule} from './project-registration/project-registration.module';
import {WelcomeComponent} from './welcome/welcome.component';

const BROWSER_LOCALE = navigator.language;

@NgModule({
  declarations: [
    AppComponent,
    SubmissionListComponent,
    NavigationComponent,
    ProjectComponent,
    SubmissionComponent,
    TabComponent,
    TabsComponent,
    FilesComponent,
    UploadInfoComponent,
    SubmitComponent,
    MetadataListComponent,
    ProjectListComponent,
    AllProjectsComponent,
    UploadComponent,
    LoginComponent,
    ProjectViewComponent,
    AlertComponent,
    AaiCallbackComponent,
    ProjectFormComponent,
    MyProjectsComponent,
    GlobalHeaderComponent,
    RegistrationComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    SharedModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    NgxDatatableModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MaterialModule,
    AaiSecurity,
    MetadataSchemaFormModule,
    ProjectRegistrationModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OidcInterceptor,
      multi: true
    },
    {provide: MAT_DATE_LOCALE, useValue: BROWSER_LOCALE},
    IngestService,
    BrokerService,
    FormBuilder,
    AlertService,
    LoaderService,
    FlattenService,
    SchemaService,
  ],
  bootstrap: [AppComponent]
})


export class AppModule {
}

