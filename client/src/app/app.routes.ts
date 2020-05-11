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
import {UserIsLoggedIn} from "./shared/services/user-is-logged-in.service";
import {UserIsWrangler} from "./shared/services/user-is-wrangler.service";
import {WranglerOrOwner} from "./shared/services/wrangler-or-owner.service";

export const ROUTES: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'aai-callback', component: AaiCallbackComponent},

  {path: '', component: MyProjectsComponent, canActivate: [UserIsLoggedIn]},
  {path: 'home', component: MyProjectsComponent, canActivate: [UserIsLoggedIn]},
  {path: 'submissions/list', component: SubmissionListComponent,  canActivate: [UserIsLoggedIn, UserIsWrangler]},
  {path: 'submissions/:tab/upload', component: SubmissionComponent,  canActivate: [UserIsLoggedIn, UserIsWrangler]},
  {path: 'submissions/detail/:id', component: SubmissionComponent,  canActivate: [UserIsLoggedIn, UserIsWrangler]},
  {path: 'submissions/detail/:id/:tab', component: SubmissionComponent,  canActivate: [UserIsLoggedIn, UserIsWrangler]},

  {path: 'projects/detail/:id', component: ProjectComponent, canActivate: [UserIsLoggedIn, WranglerOrOwner]},
  {path: 'projects/detail', component: ProjectComponent, canActivate: [UserIsLoggedIn, WranglerOrOwner]},
  {path: 'projects/all', component: AllProjectsComponent, canActivate: [UserIsLoggedIn, UserIsWrangler]},

  {path: 'projects', component: MyProjectsComponent, canActivate: [UserIsLoggedIn]},
  {path: 'projects/new', component: ProjectFormComponent, canActivate: [UserIsLoggedIn]},
  {path: 'projects/:uuid', component: ProjectFormComponent, canActivate: [UserIsLoggedIn, WranglerOrOwner]},
  {path: 'projects/:uuid/:tab', component: ProjectFormComponent, canActivate: [UserIsLoggedIn, WranglerOrOwner]},

  {path: 'registration', component: RegistrationComponent, canActivate: [UserIsLoggedIn]},

  {path: '**', redirectTo: ''}
];
