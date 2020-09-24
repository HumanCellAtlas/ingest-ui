import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-select-radio',
  templateUrl: './select-radio.component.html',
  styleUrls: ['./select-radio.component.css']
})
export class SelectRadioComponent {
  @Input()
  id: string;

  @Input()
  value: string;

  @Input()
  label: string;

  @Input()
  helperText: string;

  @Input()
  isRequired: boolean;

  @Input()
  error: string;

  @Input()
  placeholder: string;

  @Input()
  disabled: boolean;

  @Input()
  options: string[];

  @Input()
  inline = true;

  @Output()
  valueChanged = new EventEmitter<string>();

  onSelectedValueChange(value) {
    this.valueChanged.emit(value);
  }
}
