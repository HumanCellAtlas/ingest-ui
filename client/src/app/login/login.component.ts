import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {mergeMap} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

  constructor(public auth: AuthService, public router: Router) {}

  login(): void {
    if (this.auth.isAuthenticated()) {
      alert('You are already logged in. Redirecting to homepage...')
      this.router.navigate(['/home']);
    } else {
      this.auth.authorize();
    }
  }
}
