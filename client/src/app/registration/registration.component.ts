import {Component, OnInit} from '@angular/core';
import {AuthenticationService, DuplicateAccount} from "../core/authentication.service";
import {AaiService} from "../aai/aai.service";
import {User} from "oidc-client";

interface RegistrationStatus {
  success: boolean;
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  termsAccepted: boolean = false;
  status: RegistrationStatus;

  constructor(private aaiService: AaiService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
  }

  proceed() {
    this.aaiService.getUser().subscribe((user: User) => {
      if (this.termsAccepted) {
        this.status = <RegistrationStatus>{};
        this.authenticationService.register(user.access_token)
          .then(() => {
            this.status.success = true;
          })
          .catch((error: DuplicateAccount) => {
            this.status.success = false;
          });
      }
    })
  }
}
