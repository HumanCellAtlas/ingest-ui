import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MetadataFormHelper} from '../../models/metadata-form-helper';
import {map, startWith} from 'rxjs/operators';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
  selector: 'app-enum-input',
  templateUrl: './enum-input.component.html',
  styleUrls: ['./enum-input.component.css']
})
export class EnumInputComponent extends BaseInputComponent implements OnInit {
  options$: Observable<string[]>;

  searchControl: AbstractControl;

  formHelper: MetadataFormHelper;
  enumValues: string[];

  value: string;

  constructor() {
    super();
    this.formHelper = new MetadataFormHelper();
  }


  ngOnInit() {
    super.ngOnInit();

    this.value = this.control.value;

    this.searchControl = this.createSearchControl(this.control.value);

    this.enumValues = this.metadata.schema.enum;

    this.options$ = this.searchControl.valueChanges
      .pipe(
        startWith(null),
        map((value: string | null) => value ? this._filter(value) : this.enumValues.slice())
      );
  }

  updateControl(value: string) {
    this.control.markAllAsTouched();
    if (!value) {
      this.control.reset();
    } else {
      this.value = value;
      this.control.setValue(value);
    }
  }

  createSearchControl(value: string) {
    return new FormControl({
      value: value ? value : '',
      disabled: this.metadata.isDisabled
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.enumValues.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSelectAborted($event: any) {
    this.control.markAllAsTouched();
  }
}
