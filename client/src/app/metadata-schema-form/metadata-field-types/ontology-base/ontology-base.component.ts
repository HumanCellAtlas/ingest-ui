import {Component, OnInit} from '@angular/core';
import {Ontology} from '../../../shared/models/ontology';
import {FormControl} from '@angular/forms';
import {OntologyService} from '../../../shared/services/ontology.service';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {concatMap, startWith} from 'rxjs/operators';
import {BaseInputComponent} from '../base-input/base-input.component';
import {MetadataFormService} from '../../metadata-form.service';

@Component({
  selector: 'app-ontology-base',
  template: ``,
  styleUrls: ['./ontology-base.component.css']
})
export class OntologyBaseComponent extends BaseInputComponent implements OnInit {
  searchControl: FormControl;
  options$: Observable<Ontology[]>;
  olsUrl: string = environment.OLS_URL;

  constructor(protected ols: OntologyService, protected metadataFormService: MetadataFormService) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    const ontologyReference = `Please note that if the search result is too large, not all options may be displayed. Please see <a href="${this.olsUrl}" target="_blank">Ontology Lookup Service</a> for reference.`;
    this.helperText = this.helperText + ' ' + ontologyReference;
    const value: Ontology = this.metadataFormService.cleanFormData(this.control.value);
    this.searchControl = this.createSearchControl(value);
    this.options$ = this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value ? this.searchControl.value : ''),
        concatMap(value => this.onSearchValueChanged(value))
      );
  }

  createSearchControl(value: Ontology) {
    return new FormControl({
      value: value && value.ontology_label ? value : '',
      disabled: this.metadata.isDisabled
    });
  }

  displayOntology(ontology: Ontology | string) {
    if (typeof ontology === 'string') {
      return '';
    }
    return ontology && ontology.ontology_label && ontology.ontology ? `${ontology.ontology_label} (${ontology.ontology})` : '';
  }

  onSearchValueChanged(value: string | Ontology): Observable<Ontology[]> {
    const searchText = typeof value === 'string' ? value.toLowerCase() :
      value.ontology_label ? value.ontology_label.toLowerCase() : '';

    return this.ols.lookup(this.metadata.schema, searchText);
  }

}
