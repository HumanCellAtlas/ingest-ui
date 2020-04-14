import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {NgxDatatableModule} from '@swimlane/ngx-datatable';

import {SharedModule} from './shared/shared.module';

import {IngestService} from './shared/services/ingest.service';
import {BrokerService} from './shared/services/broker.service';

import {ROUTES} from './app.routes';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {SubmissionListComponent} from './submission-list/submission-list.component';
import {NavigationComponent} from './navigation/navigation.component';
import {WelcomeComponent} from './submitter/welcome/welcome.component';
import {SubmissionComponent} from './submission/submission.component';
import {TabComponent} from './shared/components/tab/tab.component';
import {TabsComponent} from './shared/components/tabs/tabs.component';
import {FilesComponent} from './submission/files/files.component';
import {UploadInfoComponent} from './submission/files/upload-info/upload-info.component';
import {SubmitComponent} from './submission/submit/submit.component';

import {MetadataComponent} from './submission/metadata/metadata.component';
import {MetadataListComponent} from './submission/metadata-list/metadata-list.component';

import {ProjectComponent} from './project/project.component';
import {ProjectListComponent} from './shared/components/project-list/project-list.component';
import {AllProjectsComponent} from './all-projects/all-projects.component';
import {MyProjectsComponent} from './submitter/my-projects/my-projects.component';
import {ProjectFormComponent} from './submitter/project-form/project-form.component';

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
import {MaterialDesignFrameworkModule} from '@ajsf/material';


@NgModule({
  declarations: [
    AppComponent,
    SubmissionListComponent,
    NavigationComponent,
    WelcomeComponent,
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
    MetadataComponent,
    LoginComponent,
    ProjectViewComponent,
    AlertComponent,
    AaiCallbackComponent,
    ProjectFormComponent,
    MyProjectsComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    SharedModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    NgxDatatableModule,
    FlexLayoutModule,
    MatCardModule,
    MatChipsModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MaterialDesignFrameworkModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OidcInterceptor,
      multi: true
    },
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

