import {Component, Input, OnInit} from '@angular/core';
import {Metadata} from '../../metadata-schema-form/models/metadata';
import {AbstractControl, FormControl, Validators} from '@angular/forms';

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

  firstNameCtrl: FormControl;

  lastNameCtrl: FormControl;

  constructor() {
  }

  ngOnInit(): void {
    this.firstNameCtrl = new FormControl('', [Validators.required]);
    this.lastNameCtrl = new FormControl('', [Validators.required]);

    const names = this.control.value ? this.control.value.split(',') : [];
    if (names.length === 3) {
      const firstName = names[0];
      const lastName = names[2];

      this.firstNameCtrl.setValue(firstName);
      this.lastNameCtrl.setValue(lastName);
    }

    this.firstNameCtrl.valueChanges.subscribe(val => {
      const firstName = val;
      const lastName = this.lastNameCtrl.value;
      this.onChange(firstName, lastName);
    });

    this.lastNameCtrl.valueChanges.subscribe(val => {
      const firstName = this.firstNameCtrl.value;
      const lastName = val;
      this.onChange(firstName, lastName);
    });
  }

  onChange(firstName: string, lastName: string) {
    this.setName(firstName, lastName);
  }

  setName(firstName: string, lastName: string) {
    if (firstName || lastName) {
      firstName = firstName ? firstName : '';
      lastName = lastName ? lastName : '';
      this.control.setValue(`${firstName},,${lastName}`);
    }
  }

  onBlur() {
    this.control.markAllAsTouched();
  }
}
