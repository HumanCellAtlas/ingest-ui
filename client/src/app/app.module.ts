import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JwtModule} from '@auth0/angular-jwt';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatRadioModule, MatSelectModule,
  MatTabsModule, MatTreeModule
} from '@angular/material';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {NgxDatatableModule} from '@swimlane/ngx-datatable';

import {SharedModule} from './shared/shared.module';


import {IngestService} from './shared/services/ingest.service';
import {BrokerService} from './shared/services/broker.service';
import {AuthService} from './auth/auth.service';

import {ROUTES} from './app.routes';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SubmissionListComponent} from './home/submission-list/submission-list.component';
import {NavigationComponent} from './navigation/navigation.component';
import {WelcomeComponent} from './home/welcome/welcome.component';
import {NewSubmissionComponent} from './home/new-submission/new-submission.component';
import {CallbackComponent} from './callback/callback.component';
import {HomeComponent} from './home/home.component';
import {ProjectComponent} from './shared/components/project/project.component';
import {SubmissionComponent} from './submission/submission.component';
import {TabComponent} from './shared/components/tab/tab.component';
import {TabsComponent} from './shared/components/tabs/tabs.component';
import {FilesComponent} from './submission/files/files.component';
import {UploadInfoComponent} from './submission/files/upload-info/upload-info.component';
import {SubmitComponent} from './submission/submit/submit.component';
import {MetadataComponent} from './submission/metadata/metadata.component';
import {MetadataListComponent} from './submission/metadata-list/metadata-list.component'
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ProjectListComponent} from './projects/project-list/project-list.component';
import {ProjectsComponent} from './projects/projects.component';
import {UploadComponent} from './shared/components/upload/upload.component';
import {LoginComponent} from './login/login.component';
import {OverviewComponent } from './submission/overview/overview.component';
import {AlertService} from "./shared/services/alert.service";
import {AlertComponent} from "./shared/components/alert/alert.component";
import {LoaderService} from "./shared/services/loader.service";
import {FlattenService} from "./shared/services/flatten.service";
import {SchemaService} from "./shared/services/schema.service";

import {MetadataTableComponent} from './submission/metadata-table/metadata-table.component';

import {
  MatIconModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule,
  MatSortModule, MatTableModule, MatTooltipModule, MatProgressBarModule
} from "@angular/material";

import { MetadataFieldComponent } from './submission/metadata-field/metadata-field.component';

import {environment} from '../environments/environment';
import { MetadataDetailComponent } from './metadata-detail/metadata-detail.component';
import {CdkTableModule} from "@angular/cdk/table";
import {CdkTreeModule} from '@angular/cdk/tree';

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
    SubmissionComponent,
    TabComponent,
    TabsComponent,
    FilesComponent,
    UploadInfoComponent,
    SubmitComponent,
    MetadataListComponent,
    ProjectListComponent,
    ProjectsComponent,
    UploadComponent,
    MetadataComponent,
    LoginComponent,
    OverviewComponent,
    AlertComponent,
    MetadataTableComponent,
    MetadataFieldComponent,
    MetadataDetailComponent
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
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.DOMAIN_WHITELIST.split(',')
      }
    }),
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
    CdkTableModule,
    CdkTreeModule,
    MatTreeModule
  ],
  providers: [
    IngestService,
    BrokerService,
    AuthService,
    FormBuilder,
    AlertService,
    LoaderService,
    FlattenService,
    SchemaService
  ],
  bootstrap: [AppComponent]
})


export class AppModule {
}

