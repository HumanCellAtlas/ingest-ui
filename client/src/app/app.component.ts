import {Component} from "@angular/core";
import {AuthService} from './auth/auth.service';
import {LoaderService} from "./shared/services/loader.service";
import {SchemaService} from "./shared/services/schema.service";
import {TimerObservable} from "rxjs/observable/TimerObservable";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  showLoader: boolean;
  authInterval = 5000;
  alive = true;

  constructor(public auth: AuthService,  private loaderService: LoaderService, private schemaService: SchemaService) {
    TimerObservable.create(0, this.authInterval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
         auth.handleAuthentication();
      });

    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });



  }

}
