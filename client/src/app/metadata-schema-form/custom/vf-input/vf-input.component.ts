import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {FormItemData} from '../../form-item/form-item.component';
import {toTitleCase} from 'codelyzer/util/utils';

export const VF_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VfInputComponent),
  multi: true,
};

@Component({
  selector: 'app-vf-input',
  templateUrl: './vf-input.component.html',
  providers: [VF_INPUT_VALUE_ACCESSOR],
  styleUrls: ['./vf-input.component.css', '../../form-item/form-item.component.css']
})
export class VfInputComponent implements ControlValueAccessor, OnInit {

  constructor() {
  }

  static CHECKBOX_VIEW = {
    true: 'yes',
    false: 'no'
  };
  @Input()
  id: string;

  // TODO form item data
  @Input()
  label: string;

  @Input()
  helperText: string;

  @Input()
  isRequired: boolean;

  @Input()
  disabled: boolean;

  data: FormItemData;
  // end form item data

  inputType: string;

  @Input()
  placeholder: string;

  value: any;

  @Input()
  readonly: boolean;

  @Input()
  dataType: string;

  @Input()
  error: string;

  touched = false;

  INPUT_TYPE = {
    'string': 'text',
    'boolean': 'checkbox',
    'integer': 'number'
  };

  onChange = (text: string) => {
  }

  onTouched = () => {
  }

  ngOnInit(): void {
    this.inputType = this.INPUT_TYPE[this.dataType];
    // TODO form item data
    this.data = <FormItemData> {
      label: this.label,
      helperText: this.helperText,
      isRequired: this.isRequired,
      disabled: this.disabled
    };
  }

  registerOnChange(fn: (text: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.data.disabled = isDisabled; // TODO merge these
  }

  writeValue(value: any): void {
    this.value = value;
  }

  staticView(): string {
    if (!this.value) { return '(not specified)'; }
    let content = this.value as string;
    if (this.inputType === 'checkbox' && content in VfInputComponent.CHECKBOX_VIEW) {
      content = toTitleCase(VfInputComponent.CHECKBOX_VIEW[content]);
    }
    return content;
  }

  change($event) {
    if (this.inputType === 'text') {
      this.onChange($event.target.value);
    }
    if (this.inputType === 'number') {
      this.onChange($event.target.valueAsNumber);
    }
    if (this.inputType === 'checkbox') {
      this.onChange($event.target.checked);
    }
  }

  onBlur($event) {
    this.onTouched();
    this.touched = true;
  }
}
