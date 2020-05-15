import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {COMMA, DOWN_ARROW, ENTER, ESCAPE, TAB} from '@angular/cdk/keycodes';
import {concatMap, startWith} from 'rxjs/operators';
import {AbstractControl, FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {Metadata} from '../../metadata';
import {OntologyInputComponent} from '../ontology-input/ontology-input.component';
import {OntologyService} from '../../../services/ontology.service';
import {Ontology} from '../ontology-input/ontology';
import {JsonSchema} from '../../json-schema';

@Component({
  selector: 'app-multiple-select',
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.css']
})
export class MultipleSelectComponent extends OntologyInputComponent implements OnInit {
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  formControl = new FormControl();
  filteredValues: Observable<Ontology[]>;
  selectedValues: Ontology[] = [];

  @ViewChild('input') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('input', {read: MatAutocompleteTrigger}) autoComplete;
  @ViewChild('selectionList') fruitSelectionList: MatSelectionList;

  metadata: Metadata;
  control: AbstractControl;
  id: string;

  label: string;
  helperText: string;
  isRequired: boolean;
  error: string;
  example: string;
  disabled: boolean;

  constructor(protected ols: OntologyService) {
    super(ols);
  }


  ngOnInit() {
    const userFriendly = this.metadata.schema.user_friendly;
    this.label = userFriendly ? userFriendly : this.metadata.key;

    const guidelines = this.metadata.schema.guidelines;
    const description = this.metadata.schema.description;
    this.helperText = guidelines ? guidelines : description;

    this.isRequired = this.metadata.isRequired;

    this.example = this.metadata.schema.example;


    this.searchParams = this.createSearchParams(this.metadata.schema.items as JsonSchema);

    this.searchControl = this.createSearchControl(this.control.value);

    this.filteredValues = this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value ? this.searchControl.value : ''),
        concatMap(value => this.olsLookup(value))
      );
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

  remove(ontology: Ontology): void {
    const index = this.selectedValues.indexOf(ontology);
    if (index >= 0) {
      this.selectedValues.splice(index, 1);
    }
  }

  onSelectionChange(event: MatSelectionListChange): void {
    this.updateSelectedValues(event.option.value);
    this.fruitInput.nativeElement.value = '';
    this.formControl.setValue(null);
  }

  addOntology(ontology: Ontology): void {
    this.selectedValues.push(ontology);
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

  createSearchParams(schema: JsonSchema): object {
    if (!schema) {
      return {};
    }

    const graphRestriction = schema.properties['ontology']['graph_restriction'];
    const ontologyClass: string = graphRestriction['classes'][0]; // TODO support only 1 class for now
    const ontologyRelation: string = graphRestriction['relations'][0]; // TODO support only 1 relation for now

    const searchParams = {
      groupField: 'iri',
      start: 0,
      ontology: 'efo'
    };

    const olsClass = ontologyClass.replace(':', '_');
    searchParams[this.OLS_RELATION[ontologyRelation]] = 'http://purl.obolibrary.org/obo/OBI_0000711';

    return searchParams;
  }
}
