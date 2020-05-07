import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-vf-asterisk',
  templateUrl: './vf-asterisk.component.html',
  styleUrls: ['./vf-asterisk.component.css']
})
export class VfAsteriskComponent implements OnInit {
  @Input()
  isRequired: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
