import {Component, OnInit} from '@angular/core';
import {Metadata} from '../metadata-form/metadata';
import {AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-metadata-field',
  templateUrl: './metadata-field.component.html',
  styleUrls: ['./metadata-field.component.css']
})
export class MetadataFieldComponent implements OnInit {
  metadata: Metadata;
  control: AbstractControl;

  constructor() {

  }

  ngOnInit(): void {
  }

}
