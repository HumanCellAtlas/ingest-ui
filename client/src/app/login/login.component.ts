import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import { environment } from '../../environments/environment.prod';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  version = environment.version;

  constructor(public auth: AuthService, public router: Router) {
    if(auth.isAuthenticated()){
      router.navigate(['/home'])
    }
  }

  ngOnInit() {
  }

}
