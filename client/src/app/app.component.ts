import {Component} from '@angular/core';
import {LoaderService} from './shared/services/loader.service';
import 'rxjs-compat/add/operator/takeWhile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showLoader: boolean;

  constructor(private loaderService: LoaderService) {
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });

  }

}
