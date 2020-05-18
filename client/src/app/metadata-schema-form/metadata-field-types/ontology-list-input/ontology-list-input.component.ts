import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {Ontology} from '../../../shared/models/ontology';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatSelectionList} from '@angular/material/list';
import {Metadata} from '../../models/metadata';
import {OntologyService} from '../../../shared/services/ontology.service';
import {concatMap, startWith} from 'rxjs/operators';
import {JsonSchema} from '../../models/json-schema';
import {MetadataFormHelper} from '../../models/metadata-form-helper';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-ontology-list-input',
  templateUrl: './ontology-list-input.component.html',
  styleUrls: ['./ontology-list-input.component.css']
})
export class OntologyListInputComponent implements OnInit {
  metadata: Metadata;
  control: AbstractControl;
  id: string;

  options$: Observable<Ontology[]>;

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
  olsUrl: string = environment.OLS_URL;

  constructor(protected ols: OntologyService) {
    this.formHelper = new MetadataFormHelper();
  }


  ngOnInit() {
    const userFriendly = this.metadata.schema.user_friendly;
    this.label = userFriendly ? userFriendly : this.metadata.key;

    const ontologyReference = `Please note that if the search result is too large, not all options may be displayed. Please see <a href="${this.olsUrl}" target="_blank">Ontology Lookup Service</a> for reference.`;
    const guidelines = this.metadata.schema.guidelines;
    const description = this.metadata.schema.description;
    this.helperText = guidelines ? guidelines : description;
    this.helperText = this.helperText + ' ' + ontologyReference;



    this.isRequired = this.metadata.isRequired;

    this.example = this.metadata.schema.example;

    this.disabled = this.metadata.isDisabled || this.metadata.isDisabled;

    this.searchControl = this.createSearchControl(this.control.value);

    this.options$ = this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value ? this.searchControl.value : ''),
        concatMap(value => this.onSearchValueChanged(value))
      );
  }

  onSearchValueChanged(value: string | Ontology): Observable<Ontology[]> {
    const searchText = typeof value === 'string' ? value.toLowerCase() : value.ontology_label ? value.ontology_label.toLowerCase() : '';
    return this.ols.lookup(this.metadata.schema.items as JsonSchema, searchText).map(data => {
      return data;
    });
  }

  removeFormControl(i: number) {
    if (confirm('Are you sure?')) {
      const formArray = this.control as FormArray;
      formArray.removeAt(i);
    }
  }

  addFormControl(ontology: Ontology) {
    const formArray = this.control as FormArray;
    const count = formArray.length;

    const formGroup: FormGroup = this.formHelper.toFormGroup(this.metadata.schema.items as JsonSchema, ontology);
    formArray.insert(count, formGroup);
  }

  createSearchControl(value: Ontology) {
    return new FormControl({
      value: value && value.ontology ? value : '',
      disabled: this.metadata.isDisabled
    });
  }

  displayOntology(ontology: Ontology | string) {
    if (typeof ontology === 'string') {
      return '';
    }
    return ontology && ontology.ontology_label ? `${ontology.ontology_label} (${ontology.ontology})` : '';
  }
}
