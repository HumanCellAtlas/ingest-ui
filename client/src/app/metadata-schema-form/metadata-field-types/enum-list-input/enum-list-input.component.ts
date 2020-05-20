import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Metadata} from '../../models/metadata';
import {AbstractControl, FormArray, FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {Ontology} from '../../../shared/models/ontology';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatSelectionList} from '@angular/material/list';
import {MetadataFormHelper} from '../../models/metadata-form-helper';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-enum-list-input',
  templateUrl: './enum-list-input.component.html',
  styleUrls: ['./enum-list-input.component.css']
})
export class EnumListInputComponent implements OnInit {
  metadata: Metadata;
  control: AbstractControl;
  id: string;

  options$: Observable<string[]>;

  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('input', {read: MatAutocompleteTrigger}) autoComplete;
  @ViewChild('selectionList') selectionList: MatSelectionList;

  label: string;
  helperText: string;
  isRequired: boolean;
  error: string;
  example: string;
  disabled: boolean;

  searchControl: AbstractControl;

  formHelper: MetadataFormHelper;
  enumValues: string[];

  constructor() {
    this.formHelper = new MetadataFormHelper();
  }


  ngOnInit() {
    const userFriendly = this.metadata.schema.user_friendly;
    this.label = userFriendly ? userFriendly : this.metadata.key;

    const guidelines = this.metadata.schema.guidelines;
    const description = this.metadata.schema.description;
    this.helperText = guidelines ? guidelines : description;

    this.isRequired = this.metadata.isRequired;

    this.disabled = this.metadata.isDisabled || this.metadata.isDisabled;

    this.example = this.metadata.schema.example;

    this.searchControl = this.createSearchControl(this.control.value);

    this.enumValues = this.metadata.schema.enum;

    this.options$ = this.searchControl.valueChanges
      .pipe(
        startWith(null),
        map((value: string | null) => value ? this._filter(value) : this.enumValues.slice())
      );
  }

  removeFormControl(i: number) {
    if (confirm('Are you sure?')) {
      const formArray = this.control as FormArray;
      formArray.removeAt(i);
    }
  }

  addFormControl(value: string) {
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

}
