import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-analyses',
  templateUrl: './analyses.component.html',
  styleUrls: ['./analyses.component.css']
})
export class AnalysesComponent implements OnInit {

  @Input() analyses;

  constructor() { }

  ngOnInit() {
  }

}
