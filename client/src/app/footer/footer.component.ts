import {Component, Input, OnInit} from '@angular/core';
import {AaiService} from "../aai/aai.service";
import {Subject} from "rxjs";
import {User} from "oidc-client";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private aai: AaiService) { }

  ngOnInit(): void {
  }

  private _user$: Subject<User>;

  @Input()
  set user$(user$: Subject<User>) {
    this._user$ = user$
  }

  get user$(): Subject<User> {
    return this._user$
  }

  logout(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
      this.aai.logout();
    }
  }
}
