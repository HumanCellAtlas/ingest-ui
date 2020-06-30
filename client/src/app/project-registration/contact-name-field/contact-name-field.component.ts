import {Component, Input, OnInit} from '@angular/core';
import {Metadata} from '../../metadata-schema-form/models/metadata';
import {AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-contact-name-field',
  templateUrl: './contact-name-field.component.html',
  styleUrls: ['./contact-name-field.component.css']
})
export class ContactNameFieldComponent implements OnInit {
  @Input()
  metadata: Metadata;

  @Input()
  control: AbstractControl;

  @Input()
  id: string;

  firstName: string;
  lastName: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  onChange(firstName: string, lastName: string) {
    this.control.setValue(`${firstName},,${lastName}`);
  }
}
