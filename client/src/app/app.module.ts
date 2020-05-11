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
import {GlobalHeaderComponent} from './global-header/global-header.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AaiSecurity} from './aai/aai.module';
import { RegistrationComponent } from './registration/registration.component';
import {MatDatepickerModule} from '@angular/material/datepicker';


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
    MyProjectsComponent,
    GlobalHeaderComponent,
    RegistrationComponent
  ],
  imports: [
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
    MaterialDesignFrameworkModule,
    AaiSecurity,
    MatDatepickerModule,
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

