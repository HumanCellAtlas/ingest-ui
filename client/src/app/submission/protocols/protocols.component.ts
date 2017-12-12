import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-protocols',
  templateUrl: './protocols.component.html',
  styleUrls: ['./protocols.component.css']
})
export class ProtocolsComponent implements OnInit {
  @Input() protocols;

  constructor() { }

  ngOnInit() {
  }

}
