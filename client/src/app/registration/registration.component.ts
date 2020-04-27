import {Component, OnInit} from '@angular/core';
import {AuthenticationService, RegistrationErrorCode, RegistrationFailed} from "../core/authentication.service";
import {AaiService} from "../aai/aai.service";
import {User} from "oidc-client";

const messages = {
  success: 'Your account was successfully created. Click OK to return to the home page.',
  error: {
    [RegistrationErrorCode.Duplication]:
      'An account using your profile is already registered. Please check with the administrator for help.',
    [RegistrationErrorCode.ServiceError]:
      'Registration failed due to a service error. Please check back again, or contact support.'
  }
}

interface RegistrationStatus {
  success: boolean;
  message: string;
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
            this.status.message = messages.success;
          })
          .catch((failure: RegistrationFailed) => {
            this.status.success = false;
            this.status.message = messages.error[failure.errorCode];
          });
      }
    })
  }
}
