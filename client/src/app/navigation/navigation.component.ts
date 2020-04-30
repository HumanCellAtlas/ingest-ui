import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AaiService} from '../aai/aai.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationComponent implements OnInit {
  isLoggedIn: boolean;


  constructor(private aai: AaiService) {
    this.aai.getUserSubject().subscribe(user => {
      this.isLoggedIn = user && !user.expired;
    });
  }

  ngOnInit() {

  }

}
