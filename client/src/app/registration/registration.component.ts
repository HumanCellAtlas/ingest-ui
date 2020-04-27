import {Component, OnInit} from '@angular/core';
import {AuthenticationService, RegistrationFailed} from "../core/authentication.service";
import {AaiService} from "../aai/aai.service";
import {User} from "oidc-client";

interface RegistrationStatus {
  success: boolean;
  errorCode: string;
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
          .catch((failure: RegistrationFailed) => {
            this.status.success = false;
            this.status.errorCode = failure.errorCode;
          });
      }
    })
  }
}
