import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationComponent implements OnInit {

  profile: any;

  constructor(public auth: AuthService) {

  }

  ngOnInit() {
    this.auth.getProfile().subscribe((profile)=>{
      this.profile = profile
    });
  }

}
