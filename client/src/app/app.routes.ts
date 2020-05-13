import {Routes} from '@angular/router';
import {ProjectComponent} from './project/project.component';
import {SubmissionComponent} from './submission/submission.component';
import {AllProjectsComponent} from './all-projects/all-projects.component';
import {LoginComponent} from './login/login.component';
import {AaiCallbackComponent} from './aai-callback/aai-callback.component';
import {ProjectFormComponent} from './submitter/project-form/project-form.component';
import {MyProjectsComponent} from './submitter/my-projects/my-projects.component';
import {SubmissionListComponent} from './submission-list/submission-list.component';
import {RegistrationComponent} from './registration/registration.component';
import {UserIsLoggedInGuard} from './shared/services/user-is-logged-in.guard';
import {UserIsWranglerGuard} from './shared/services/user-is-wrangler.guard';
import {WranglerOrOwnerGuard} from './shared/services/wrangler-or-owner.guard';

export const ROUTES: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'aai-callback', component: AaiCallbackComponent},

  {path: '', component: MyProjectsComponent, canActivate: [UserIsLoggedInGuard]},
  {path: 'home', component: MyProjectsComponent, canActivate: [UserIsLoggedInGuard]},
  {path: 'registration', component: RegistrationComponent, canActivate: [UserIsLoggedInGuard]},
  {path: 'projects', component: MyProjectsComponent, canActivate: [UserIsLoggedInGuard]},
  {path: 'projects/new', component: ProjectFormComponent, canActivate: [UserIsLoggedInGuard]},

  {path: 'projects/all', component: AllProjectsComponent, canActivate: [UserIsLoggedInGuard, UserIsWranglerGuard]},
  {path: 'submissions/list', component: SubmissionListComponent,  canActivate: [UserIsLoggedInGuard, UserIsWranglerGuard]},

  {path: 'projects/detail/:id', component: ProjectComponent, canActivate: [UserIsLoggedInGuard, WranglerOrOwnerGuard]},
  {path: 'projects/detail', component: ProjectComponent, canActivate: [UserIsLoggedInGuard, WranglerOrOwnerGuard]},
  {path: 'projects/:uuid', component: ProjectFormComponent, canActivate: [UserIsLoggedInGuard, WranglerOrOwnerGuard]},
  {path: 'projects/:uuid/:tab', component: ProjectFormComponent, canActivate: [UserIsLoggedInGuard, WranglerOrOwnerGuard]},
  {path: 'submissions/detail', component: SubmissionComponent,  canActivate: [UserIsLoggedInGuard, WranglerOrOwnerGuard]},

  {path: '**', redirectTo: ''}
];
