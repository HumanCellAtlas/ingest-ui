import {Component, OnInit} from '@angular/core';
import {Profile} from 'oidc-client';
import {Router} from '@angular/router';
import {AaiService} from '../aai/aai.service';

@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.css']
})
export class GlobalHeaderComponent implements OnInit {
  isLoggedIn: boolean;
  userInfo: Profile;

  constructor(private router: Router,
              private aai: AaiService) {
    this.aai.user$.subscribe(user => {
      this.isLoggedIn = user && !user.expired;
      this.userInfo = user ? user.profile : null;
    });
  }

  logout(e) {
    e.preventDefault();
    this.aai.logout();
  }

  ngOnInit() {
  }

}
