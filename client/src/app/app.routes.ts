import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import {ProjectComponent} from "./submission/project/project.component";
import {NewSubmissionFormComponent} from "./new-submission-form/new-submission-form.component";
import {SubmissionComponent} from "./submission/submission.component";
import {ProjectsComponent} from "./projects/projects.component";

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'callback', component: CallbackComponent },
  { path: 'submissions/list', component: HomeComponent },
  { path: 'submissions/:id', component: SubmissionComponent },
  { path: 'projects/list', component: ProjectsComponent },
  { path: 'projects/:id', component: ProjectComponent },
  { path: 'projects', component: ProjectComponent },
  { path: '**', redirectTo: '' }
];
