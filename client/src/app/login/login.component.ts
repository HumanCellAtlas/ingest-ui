import {Component, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AaiService} from '../aai/aai.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  redirect: string;

  constructor(private aai: AaiService,
              private router: Router,
              private route: ActivatedRoute) {
    this.redirect = this.route.snapshot.queryParamMap.get('redirect');
    this.aai.userLoggedIn().subscribe( isLoggedIn => {
      if (isLoggedIn) {
        this.navigate();
      }
    });
  }

  login(): void {
    this.aai.userLoggedIn().subscribe( isLoggedIn => {
      if (isLoggedIn) {
        this.navigate();
      } else {
        this.aai.startAuthentication(this.redirect);
      }
    });
  }

  navigate() {
    if (this.redirect) {
      this.router.navigateByUrl(this.redirect);
    } else {
      this.router.navigateByUrl('/home');
    }
  }
}
