import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {SubmissionComponent} from './submission/submission.component';
import {IngestService} from './ingest.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NavigationComponent} from './navigation/navigation.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NewSubmissionComponent } from './new-submission/new-submission.component';

@NgModule({
  declarations: [
    AppComponent,
    SubmissionComponent,
    NavigationComponent,
    WelcomeComponent,
    NewSubmissionComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [IngestService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
