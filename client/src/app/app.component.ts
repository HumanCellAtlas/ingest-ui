import {Component} from "@angular/core";
import {AuthService} from './auth/auth.service';
import {LoaderService} from "./shared/services/loader.service";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Router} from "@angular/router";

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
    TimerObservable.create(0, this.authInterval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        if(!auth.isAuthenticated()){
          this.router.navigate(['/login']);
        }
      });

    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });

  }

}
