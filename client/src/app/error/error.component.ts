import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  errorMsg: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.errorMsg = this.router.getCurrentNavigation().extras.state.error
  }

}
