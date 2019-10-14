import {Component} from "@angular/core";
import {AuthService} from './auth/auth.service';
import {LoaderService} from "./shared/services/loader.service";
import {Router} from "@angular/router";
import "rxjs-compat/add/operator/takeWhile";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  showLoader: boolean;
  authInterval = 5000;
  alive = true;

  constructor(public router: Router,
              public auth: AuthService,
              private loaderService: LoaderService) {
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
  }

}
