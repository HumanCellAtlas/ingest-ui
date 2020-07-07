import {Component, OnInit} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent extends BaseInputComponent implements OnInit {
  value: Date;

  constructor() {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.value = this.control.value ? new Date(this.control.value) : undefined;
  }

  onDateChanged($event: MatDatepickerInputEvent<any>) {
    const value = $event.value as Date;
    const date = value ? value.toJSON() : '';
    this.control.setValue(date);
    this.control.markAsDirty();
  }

  onBlur() {
    this.control.markAsTouched();
    this.error = this.checkForErrors(this.control);
  }

  onDatePickerClosed() {
    this.control.markAsTouched();
  }
}
