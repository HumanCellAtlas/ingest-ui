import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() isLoggedIn$: Observable<any>;
  @Output() logout = new EventEmitter<any>();

  ngOnInit(): void {
  }

  onLogout($event: any) {
    this.logout.emit($event);
  }
}
