import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import {ProjectComponent} from "./projects/project/project.component";
import {SubmissionComponent} from "./submission/submission.component";
import {ProjectsComponent} from "./projects/projects.component";

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'callback', component: CallbackComponent },

  { path: 'submissions/list', component: HomeComponent },
  { path: 'submissions/new/:tab', component: SubmissionComponent },
  { path: 'submissions/detail/:id/:tab', component: SubmissionComponent },

  { path: 'projects/list', component: ProjectsComponent },
  { path: 'projects/new', component: ProjectComponent },
  { path: 'projects/detail/:id', component: ProjectComponent },
  { path: 'projects/detail/:projectid/submissions', component: SubmissionComponent },

  { path: '**', redirectTo: '' }
];
