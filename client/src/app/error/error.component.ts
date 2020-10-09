import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  errorMsg = 'Error - Service unavailable';
  reload: string;

  constructor(private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.reload = decodeURI(this.route.snapshot.queryParamMap.get('reload'));
  }
}
