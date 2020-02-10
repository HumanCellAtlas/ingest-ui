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

  constructor(public aai: AaiService) {
  }

  ngOnInit() {
    this.userInfo = this.aai.getUserInfo();
  }

}
