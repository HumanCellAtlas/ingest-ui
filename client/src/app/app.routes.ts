import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ProjectComponent} from './shared/components/project/project.component';
import {SubmissionComponent} from './submission/submission.component';
import {AllProjectsComponent} from './all-projects/all-projects.component';
import {LoginComponent} from './login/login.component';
import {AaiCallbackComponent} from './aai-callback/aai-callback.component';
import {AuthGuardService} from './aai/auth-guard.service';
import {ProjectFormComponent} from "./submitter/project-form/project-form.component";
import {MyProjectsComponent} from './submitter/my-projects/my-projects.component';

export const ROUTES: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'aai-callback', component: AaiCallbackComponent},

  {path: '', component: HomeComponent, canActivate: [AuthGuardService]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  {path: 'submissions/list', component: HomeComponent,  canActivate: [AuthGuardService]},
  {path: 'submissions/:tab/upload', component: SubmissionComponent,  canActivate: [AuthGuardService]},
  {path: 'submissions/detail/:id', component: SubmissionComponent,  canActivate: [AuthGuardService]},
  {path: 'submissions/detail/:id/:tab', component: SubmissionComponent,  canActivate: [AuthGuardService]},
  {path: 'submissions/detail', component: SubmissionComponent,  canActivate: [AuthGuardService]},

  {path: 'projects/detail/:projectUuid/submissions/:tab', component: SubmissionComponent,  canActivate: [AuthGuardService]},
  {path: 'projects/detail/:id', component: ProjectComponent,  canActivate: [AuthGuardService]},
  {path: 'projects/detail', component: ProjectComponent,  canActivate: [AuthGuardService]},
  {path: 'projects/all', component: AllProjectsComponent,  canActivate: [AuthGuardService]},

  {path: 'projects', component: MyProjectsComponent},
  {path: 'projects/new', component: ProjectFormComponent},
  {path: 'projects/:uuid', component: ProjectFormComponent},

  {path: '**', redirectTo: ''}
];
