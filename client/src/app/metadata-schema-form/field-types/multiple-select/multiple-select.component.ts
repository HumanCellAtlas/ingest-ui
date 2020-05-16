import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {COMMA, DOWN_ARROW, ENTER, ESCAPE, TAB} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {Ontology} from '../../../shared/models/ontology';

@Component({
  selector: 'app-multiple-select',
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.css']
})
export class MultipleSelectComponent implements OnInit {
  @Input()
  id;

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
  example: string;

  @Input()
  disabled: boolean;

  @Input()
  options$: Observable<any[]>;

  @Input()
  displayWith: ((value: any) => string) | null;

  @Output()
  searchValueChanged = new EventEmitter<string>();

  @Output()
  valueAdded = new EventEmitter<any>();

  @Output()
  valueRemoved = new EventEmitter<number>();

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  formControl = new FormControl();
  selectedValues: any[] = this.value ? this.value : [];

  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('input', {read: MatAutocompleteTrigger}) autoComplete;
  @ViewChild('selectionList') fruitSelectionList: MatSelectionList;

  searchControl: FormControl;

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
      this.searchValueChanged.emit(value.toLowerCase());
    }
  }

  onInputKeyboardNavigation(event) {
    switch (event.keyCode) {
      case DOWN_ARROW:
        this.fruitSelectionList.options.first.focus();
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

  remove(ontology: Ontology): void {
    const index = this.selectedValues.indexOf(ontology);
    if (index >= 0) {
      this.selectedValues.splice(index, 1);
      this.valueRemoved.emit(index);
    }
  }

  onSelectionChange(event: MatSelectionListChange): void {
    this.updateSelectedValues(event.option.value);
    this.value = '';
    this.formControl.setValue(null);
  }

  addOntology(ontology: Ontology): void {
    this.selectedValues.push(ontology);
    this.valueAdded.emit(ontology);
  }

  isSelected(option: Ontology): boolean {
    return this.selectedValues.indexOf(option) >= 0;
  }

  updateSelectedValues(ontology: Ontology): void {
    if (this.isSelected(ontology)) {
      this.remove(ontology);
    } else {
      this.addOntology(ontology);
    }
  }

  createSearchControl() {
    return new FormControl({
      value: this.value,
      disabled: this.disabled
    });
  }
}
