import {Component, OnInit} from '@angular/core';
import {RegistrationService, RegistrationErrorCode, RegistrationFailed} from '../core/registration.service';
import {AaiService} from '../aai/aai.service';

const messages = {
  success: 'Your account was successfully created. Click OK to return to the home page.',
  error: {
    [RegistrationErrorCode.Duplication]:
      'An account using your profile is already registered. Please check with the administrator for help.',
    [RegistrationErrorCode.ServiceError]:
      'Registration failed due to a service error. Please check back again, or contact support.'
  }
};

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

  termsAccepted = false;
  status: RegistrationStatus;

  constructor(private aaiService: AaiService,
              private registrationService: RegistrationService) {
  }

  ngOnInit() {
  }

  proceed() {
    if (this.termsAccepted) {
      this.aaiService.getUser().subscribe(user => {
        this.status = <RegistrationStatus>{};
        this.registrationService.register(user.access_token)
          .then(() => {
            this.status.success = true;
            this.status.message = messages.success;
            // re-trigger subscribers to .getUserSubject
            // ToDo Host a similar BehaviourSubject somewhere for userAccount for separate subscription
            this.aaiService.setUserSubject(user);
          })
          .catch((failure: RegistrationFailed) => {
            this.status.success = false;
            this.status.message = messages.error[failure.errorCode];
          });
      });
    }
  }
}
