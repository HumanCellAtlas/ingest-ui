import {Component} from "@angular/core";
import {AuthService} from './auth/auth.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  successMessage: string;
  errorMessage: string

  constructor(public auth: AuthService) {
    auth.handleAuthentication();

  }

}
