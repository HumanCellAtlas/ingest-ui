import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Profile} from 'oidc-client';
import {Observable} from 'rxjs';
import {Account} from '../core/account';

@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.css']
})
export class GlobalHeaderComponent implements OnInit {
  @Input() isLoggedIn$: Observable<any>;
  @Input() userProfile$: Observable<Profile | undefined>;
  @Input() userAccount$: Observable<Account | undefined>;
  @Output() logout = new EventEmitter<any>();

  ngOnInit(): void {
  }

  onLogout($event: any) {
    this.logout.emit($event);
  }

}
