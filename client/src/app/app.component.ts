import {Component} from "@angular/core";
import {AuthService} from './auth/auth.service';
import {LoaderService} from "./shared/services/loader.service";
import {SchemaService} from "./shared/services/schema.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  showLoader: boolean;

  constructor(public auth: AuthService,  private loaderService: LoaderService, private schemaService: SchemaService) {
    auth.handleAuthentication();
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });

  }

}
