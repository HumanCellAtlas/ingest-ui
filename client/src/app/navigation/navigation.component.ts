import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {UserInfo} from "../auth/auth.model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationComponent implements OnInit {
  userInfo$: Observable<UserInfo>;

  constructor(public auth: AuthService) {
  }

  ngOnInit() {
    this.userInfo$ = this.auth.getUserInfo();
  }

}
