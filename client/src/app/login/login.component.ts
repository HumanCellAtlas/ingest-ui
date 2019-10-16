import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

  constructor(public auth: AuthService, public router: Router) {
    if(this.auth.hasValidAccessToken()){
      this.router.navigate(['/home'])
    }
  }

}
