import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {Ontology} from '../../../shared/models/ontology';
import {MetadataFormHelper} from '../../models/metadata-form-helper';
import {map, startWith} from 'rxjs/operators';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
  selector: 'app-enum-list-input',
  templateUrl: './enum-list-input.component.html',
  styleUrls: ['./enum-list-input.component.css']
})
export class EnumListInputComponent extends BaseInputComponent implements OnInit {
  options$: Observable<string[]>;

  searchControl: AbstractControl;

  formHelper: MetadataFormHelper;
  enumValues: string[];

  value: string[];

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

  removeFormControl(i: number) {
    this.control.markAllAsTouched();
    const formArray = this.control as FormArray;
    formArray.removeAt(i);
  }

  addFormControl(value: string) {
    this.control.markAllAsTouched();
    const formArray = this.control as FormArray;
    const count = formArray.length;

    const formControl: FormControl = this.formHelper.toFormControl(this.metadata, value);
    formArray.insert(count, formControl);
  }

  createSearchControl(value: Ontology) {
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
