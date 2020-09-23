import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {Account} from '../core/account';

@Component({
  selector: 'app-global-navigation',
  templateUrl: './global-navigation.component.html',
  styleUrls: ['./global-navigation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GlobalNavigationComponent implements OnInit {
  @Input() userAccount$: Observable<Account | undefined>;

  ngOnInit() {
  }
}
