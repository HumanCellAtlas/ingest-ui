import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatSelectionList} from '@angular/material/list';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {map, startWith} from 'rxjs/operators';
import { DOWN_ARROW, TAB, ESCAPE } from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-multiple-select',
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.css']
})
export class MultipleSelectComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Strawberry'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('fruitInput', {read: MatAutocompleteTrigger}) autoComplete;
  @ViewChild('fruitSelectionList') fruitSelectionList: MatSelectionList;

  constructor() { }

  ngOnInit() {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
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
        this.fruitInput.nativeElement.focus();
        this.autoComplete.closePanel();
        break;
      default:
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.addFruit(value);
    }

    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  onFruitSelectionChange(event: MatAutocompleteSelectedEvent): void {
    this.updateFruitList(event.option.value);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(option => option.toLowerCase().includes(filterValue));
  }

  addFruit(fruit: string): void {
    this.fruits.push(fruit);
  }

  isFruitSelected(fruit: string): boolean {
    return this.fruits.indexOf(fruit) >= 0;
  }

  updateFruitList(fruit: string): void {
    if (this.isFruitSelected(fruit)) {
      this.remove(fruit);
    } else {
      this.addFruit(fruit);
    }
  }

}
