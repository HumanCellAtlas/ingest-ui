import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../core/authentication.service";
import {AaiService} from "../aai/aai.service";
import {User} from "oidc-client";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  termsAccepted: boolean = false;

  constructor(private aaiService: AaiService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
  }

  proceed() {
    this.aaiService.getUser().subscribe((user: User) => {
      if (this.termsAccepted) {
        this.authenticationService.register(user.access_token);
      }
    })
  }
}
