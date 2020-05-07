import {Component, OnInit} from '@angular/core';
import {Metadata} from '../../metadata';
import {AbstractControl} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent implements OnInit {
  metadata: Metadata;
  control: AbstractControl;
  id: string;

  label: string;
  helperText: string;
  value: Date;


  constructor() {
  }

  ngOnInit(): void {
    this.label = this.metadata.schema.user_friendly ? this.metadata.schema.user_friendly : this.metadata.key;
    this.helperText = this.metadata.schema.guidelines;
    this.value = new Date(this.control.value);
  }

  onDateChanged($event: MatDatepickerInputEvent<any>) {
    const value = $event.value as Date;
    const date = value.toJSON();
    this.control.setValue(date);
  }
}
