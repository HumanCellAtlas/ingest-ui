import { Component, OnInit } from '@angular/core';
import {Observable, of} from 'rxjs';
import {AaiService} from '../aai/aai.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  isLoggedIn$: Observable<Boolean>;
  projectButtonText = 'Sign in';
  projectRouterLink = '/login';

  constructor(private aai: AaiService) { }

  ngOnInit() {
    this.isLoggedIn$ = this.aai.isUserLoggedIn();
    this.isLoggedIn$.subscribe(loggedIn => {
        if (!loggedIn) {
          return of(undefined);
        }
        this.projectButtonText = 'New Project';
        this.projectRouterLink = '/projects/register';
      }
    );
  }
}
