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
    this.aai.isUserLoggedInAndFromEBI().subscribe(isLoggedInAndFromEBI => {
      if (isLoggedInAndFromEBI) {
        alert('You are already logged in. Redirecting to homepage...');
        this.router.navigate(['/home']);
      }
    });
  }

  login(): void {
    this.aai.isUserLoggedIn().subscribe(isLoggedIn => {
      console.log('isLoggedIn login component', isLoggedIn);
      if (!isLoggedIn) {
        this.aai.startAuthentication();
      }
    });
  }
}
