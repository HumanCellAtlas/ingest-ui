import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import {ProjectComponent} from "./submission/project/project.component";
import {NewSubmissionFormComponent} from "./new-submission-form/new-submission-form.component";
import {SubmissionComponent} from "./submission/submission.component";

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'callback', component: CallbackComponent },
  // { path: 'projects', component: NewSubmissionFormComponent },
  { path: 'submissions',
    component: NewSubmissionFormComponent,
  },
  { path: 'submissions/:id',
    component: SubmissionComponent,
    // children: [
    //   {
    //     path: '',
    //     component: ProjectComponent
    //   },
    //   {
    //     path: 'data',
    //     component: SubmissionComponent
    //   },
    //   {
    //     path: 'sample',
    //     component: SubmissionComponent
    //   },
    //   {
    //     path: 'team',
    //     component: SubmissionComponent
    //   }
    //
    // ]
  },
  { path: '**', redirectTo: '' }

];
