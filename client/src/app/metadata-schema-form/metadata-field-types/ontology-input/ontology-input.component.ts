import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';
import {concatMap, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Metadata} from '../../models/metadata';
import {OntologyService} from '../../../shared/services/ontology.service';
import {Ontology} from '../../../shared/models/ontology';
import {environment} from '../../../../environments/environment';


@Component({
  selector: 'app-ontology-input',
  templateUrl: './ontology-input.component.html',
  styleUrls: ['./ontology-input.component.css']
})
export class OntologyInputComponent implements OnInit {
  metadata: Metadata;
  control: AbstractControl;
  id: string;

  label: string;
  helperText: string;
  isRequired: boolean;
  error: string;
  example: string;
  disabled: boolean;

  searchControl: FormControl;
  options$: Observable<Ontology[]>;
  olsUrl: string = environment.OLS_URL;

  constructor(private ols: OntologyService) {
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

    this.disabled = this.metadata.isDisabled || this.metadata.isDisabled;

    this.example = this.metadata.schema.example;

    this.searchControl = this.createSearchControl(this.control.value);

    this.options$ = this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value ? this.searchControl.value : ''),
        concatMap(value => this.onSearchValueChanged(value))
      );
  }

  displayOntology(ontology: Ontology | string) {
    if (typeof ontology === 'string') {
      return '';
    }
    return ontology && ontology.ontology_label ? `${ontology.ontology_label} (${ontology.ontology})` : '';
  }

  updateControl(value: Ontology | string) {
    if (typeof value === 'string') {
      value = value.trim();

      if (!value) {
        this.control.reset();
      } else {
        const originalValue = this.control.value.ontology ? this.control.value : '';
        this.searchControl.setValue(originalValue);
      }

    } else {
      this.control.patchValue(value ? value : {});
    }
  }

  onSearchValueChanged(value: string | Ontology): Observable<Ontology[]> {
    const searchText = typeof value === 'string' ? value.toLowerCase() :
      value.ontology_label ? value.ontology_label.toLowerCase() : '';

    return this.ols.lookup(this.metadata.schema, searchText);
  }

  createSearchControl(value: Ontology) {
    return new FormControl({
      value: value && value.ontology ? value : '',
      disabled: this.metadata.isDisabled
    });
  }
}
