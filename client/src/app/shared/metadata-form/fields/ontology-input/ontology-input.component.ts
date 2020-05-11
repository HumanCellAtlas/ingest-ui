import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';
import {concatMap, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Metadata} from '../../metadata';
import {OntologyService} from '../../../services/ontology.service';
import {OlsDoc} from '../../../models/ols';
import {JsonSchema} from '../../json-schema';

const OLS_RELATION = {
  'rdfs:subClassOf': 'allChildrenOf'
};

interface Ontology {
  text: string;
  ontology_label: string;
  ontology: string;
}


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
  value: Ontology;

  searchControl: FormControl;
  filteredOptions: Observable<Ontology[]>;

  searchParams: object;

  constructor(private ols: OntologyService) {
  }

  ngOnInit() {
    const userFriendly = this.metadata.schema.user_friendly ? this.metadata.schema.user_friendly : undefined;
    this.label = userFriendly ? userFriendly : this.metadata.key;
    this.helperText = this.metadata.schema.guidelines;
    this.isRequired = this.metadata.isRequired;
    this.example = this.metadata.schema.example;
    this.disabled = this.metadata.isDisabled;

    this.createSearchParams(this.metadata.schema);

    this.createSearchControl();

    this.filteredOptions = this.searchControl.valueChanges
      .pipe(
        startWith(this.value ? this.value : ''),
        concatMap(value => this.olsLookup(value))
      );
  }

  displayOntology(ontology: Ontology | string) {
    if (typeof ontology === 'string') {
      return '';
    }
    return ontology ? `${ontology.ontology_label} (${ontology.ontology})` : '';
  }

  updateControl() {
    if (typeof this.searchControl.value === 'string') {
      this.searchControl.setValue(this.control.value.ontology ? this.control.value : ''); // reset if has previous value
    } else {
      const value: OlsDoc = this.searchControl.value;
      this.control.patchValue(value);
    }
    console.log('updated control value', this.control.value);
  }

  private createSearchParams(schema: JsonSchema) {
    const graphRestriction = schema.properties['ontology']['graph_restriction'];
    const ontologyClass: string = graphRestriction['classes'][0]; // TODO support only 1 class for now
    const ontologyRelation: string = graphRestriction['relations'][0]; // TODO support only 1 relation for now

    this.searchParams = {
      groupField: 'iri',
      start: 0,
      ontology: 'efo'
    };

    const olsClass = ontologyClass.replace(':', '_');
    this.searchParams[OLS_RELATION[ontologyRelation]] = `http://www.ebi.ac.uk/efo/${olsClass}`;
  }

  private olsLookup(value: string | Ontology): Observable<Ontology[]> {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.ontology_label ? value.ontology_label.toLowerCase() : '';
    this.searchParams['q'] = filterValue ? filterValue : '*';
    return this.ols.select(this.searchParams).map(result => {
      return result.response.docs.map(doc => {
        const ontology: Ontology = {ontology: doc.obo_id, ontology_label: doc.label, text: doc.label};
        return ontology;
      });
    });
  }

  private createSearchControl() {
    this.value = this.control.value as Ontology;
    this.searchControl = new FormControl({
      value: this.value.ontology ? this.value : '',
      disabled: this.metadata.isDisabled
    });
  }
}
