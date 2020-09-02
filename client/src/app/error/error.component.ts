import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  errorMsg: string = 'Error - Service unavailable';
  redirect: string;

  constructor(private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.redirect = this.route.snapshot.queryParamMap.get('redirect');
  }

}
