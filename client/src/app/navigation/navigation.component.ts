import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IngestService} from '../shared/services/ingest.service';
import {AaiService} from '../aai/aai.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationComponent implements OnInit {
  isWrangler: boolean;
  isLoggedIn: boolean;


  constructor(private aai: AaiService, private ingestService: IngestService) {
    this.aai.isUserLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.ingestService.getUserAccount().subscribe(account => {
          this.isWrangler = account.isWrangler();
        });
      }
    });
  }

  ngOnInit() {

  }

}
