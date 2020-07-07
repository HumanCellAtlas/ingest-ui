import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {
  @Input()
  value;

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
  options$: Observable<any[]>;

  @Input()
  displayWith: ((value: any) => string) | null;

  @Output()
  searchValueChanged = new EventEmitter<string>();

  @Output()
  selectedValueChanged = new EventEmitter<any>();

  @Output()
  selectAborted = new EventEmitter<any>();


  searchControl: FormControl;
  touched: boolean;

  constructor() {
  }

  ngOnInit() {
    this.searchControl = this.createSearchControl();
    this.searchControl.valueChanges.subscribe(value => {
      this.onSearchValueChanged(value ? value : '');
    });
  }

  onSearchValueChanged(value: any) {
    if (typeof value === 'string') {
      this.touched = true;
      this.searchValueChanged.emit(value.toLowerCase());
    }
  }

  onSelectedValueChange(e: MatAutocompleteSelectedEvent) {
    this.touched = true;
    this.selectedValueChanged.emit(e.option.value);
  }

  createSearchControl() {
    return new FormControl({
      value: this.value,
      disabled: this.disabled
    });
  }

  onFocusOut(value: any) {
    this.touched = true;
    this.selectAborted.emit(value ? value : '');
    this.searchControl.setValue(value ? this.value : '');
  }
}
