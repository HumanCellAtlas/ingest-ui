import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Profile} from 'oidc-client';
import {AaiService} from '../aai/aai.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationComponent implements OnInit {
  userInfo: Profile
  isLoggedIn: boolean


  constructor(public aai: AaiService) {
    this.aai.getUserSubject().subscribe(user => {
      this.isLoggedIn = user && !user.expired;
      if (user) {
        this.userInfo = user.profile;
      }
      console.log('userinfo', this.userInfo);
      console.log('isLoggedIn', this.isLoggedIn);
    });
  }

  ngOnInit() {

  }

}
