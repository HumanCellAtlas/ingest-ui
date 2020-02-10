import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {AaiService} from '../aai/aai.service';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

  constructor(private aai: AaiService,
              private router: Router,
              private alertService: AlertService) {
    if (this.aai.isAuthenticated() && this.aai.isUserFromEBI()) {
      alert('You are already logged in. Redirecting to homepage...')
      this.router.navigate(['/home']);
    }
  }

  login(): void {
    if (this.aai.isAuthenticated()) {
      if (!this.aai.isUserFromEBI()) {
        this.alertService.error('Unauthorised', 'Your account email address is not allowed to access the page, sorry!', true);
      }
    } else {
      this.aai.startAuthentication();
    }
  }
}
