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
    const names = this.control.value ? this.control.value.split(',') : [];
    if (names.length === 3) {
      this.firstName = names[0];
      this.lastName = names[2];
    }
  }

  onChange(firstName: string, lastName: string) {
    this.setName(firstName, lastName);
  }

  setName(firstName: string, lastName: string) {
    firstName = firstName ? firstName : '';
    lastName = lastName ? lastName : '';
    this.control.setValue(`${firstName},,${lastName}`);
  }
}
