import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {COMMA, DOWN_ARROW, ENTER, ESCAPE, TAB} from '@angular/cdk/keycodes';
import {FormControl, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {MetadataFormService} from '../../metadata-form.service';
import {FormItemData} from "../../form-item/form-item.component";

@Component({
  selector: 'app-multiple-select',
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.css', '../../form-item/form-item.component.css']
})
export class MultipleSelectComponent implements OnInit {
  @Input()
  id;

  @Input()
  value: any;

  //TODO form data
  @Input()
  label: string;

  @Input()
  helperText: string;

  @Input()
  isRequired: boolean;

  @Input()
  disabled: boolean;

  data: FormItemData;
  //end form data

  @Input()
  error: string;

  @Input()
  placeholder: string;

  @Input()
  options$: Observable<any[]>;

  @Input()
  displayWith: ((value: any) => string) | null;

  @Input()
  touched: boolean;

  @Output()
  searchValueChanged = new EventEmitter<string>();

  @Output()
  valueAdded = new EventEmitter<any>();

  @Output()
  valueRemoved = new EventEmitter<number>();

  @Output()
  selectAborted = new EventEmitter<any>();

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedValues: any[];

  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {read: MatAutocompleteTrigger}) autoComplete;
  @ViewChild('selectionList') selectionList: MatSelectionList;

  searchControl: FormControl;


  constructor(private metadataFormService: MetadataFormService) {
  }


  ngOnInit() {
    this.removable = this.disabled ? false : true;
    const value = this.metadataFormService.cleanFormData(this.value);
    this.selectedValues = value && value.length > 0 ? value : [];
    this.searchControl = this.createSearchControl();
    this.searchControl.valueChanges.subscribe(val => {
      this.onSearchValueChanged(val ? val : '');
    });

    //TODO form data
    this.data = <FormItemData> {
      label: this.label,
      helperText: this.helperText,
      disabled: this.disabled,
      isRequired: this.isRequired
    }
  }

  onSearchValueChanged(value: any) {
    this.touched = true;
    if (typeof value === 'string') {
      this.searchValueChanged.emit(value.toLowerCase());
    }
  }

  onInputKeyboardNavigation(event) {
    switch (event.keyCode) {
      case DOWN_ARROW:
        this.selectionList.options.first.focus();
        break;
      default:
    }
  }

  onListKeyboardNavigation(event) {
    switch (event.keyCode) {
      case TAB:
      case ESCAPE:
        this.input.nativeElement.focus();
        this.autoComplete.closePanel();
        break;
      default:
    }
  }

  onSelectionChange(event: MatSelectionListChange): void {
    this.touched = true;
    this.updateSelectedValues(event.option.value);
  }

  updateSelectedValues(option: any): void {
    this.touched = true;
    if (this.isSelected(option)) {
      this.removeValue(option);
    } else {
      this.addValue(option);
    }
  }

  removeValue(value: any): void {
    const index = this.selectedValues.indexOf(value);
    if (index >= 0) {
      this.selectedValues.splice(index, 1);
      this.valueRemoved.emit(index);
    }
  }

  addValue(value: any): void {
    this.selectedValues.push(value);
    this.valueAdded.emit(value);
  }

  isSelected(option: any): boolean {
    let selected = false;
    this.selectedValues.forEach((selectedValue) => {
      if (JSON.stringify(option) === JSON.stringify(selectedValue)) {
        selected = true;
      }
    });
    return selected;
  }

  createSearchControl() {
    const state = {value: this.value, disabled: this.disabled};
    const formControl = this.isRequired ? new FormControl(state, Validators.required) : new FormControl(state);
    return formControl;
  }

  onFocusOut(value: any) {
    this.touched = true;
    this.selectAborted.emit(value ? value : '');
  }

  resetSearch() {
    this.searchControl.reset();
    this.input.nativeElement.value = '';
  }
}
