import {Component, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {Ontology} from '../../../shared/models/ontology';
import {OntologyService} from '../../../shared/services/ontology.service';
import {JsonSchema} from '../../models/json-schema';
import {MetadataFormHelper} from '../../models/metadata-form-helper';
import {OntologyBaseComponent} from '../ontology-base/ontology-base.component';
import {Observable} from 'rxjs';
import {MetadataFormService} from '../../metadata-form.service';
import {concatMap, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-ontology-list-input',
  templateUrl: './ontology-list-input.component.html',
  styleUrls: ['./ontology-list-input.component.css']
})
export class OntologyListInputComponent extends OntologyBaseComponent implements OnInit {
  formHelper: MetadataFormHelper;
  value: Ontology[];

  constructor(protected ols: OntologyService, protected metadataFormService: MetadataFormService) {
    super(ols, metadataFormService);
    this.formHelper = new MetadataFormHelper();
  }

  ngOnInit(): void {
    super.ngOnInit();
    const value = this.metadataFormService.cleanFormData(this.control.value);
    this.value = this.metadataFormService.isEmpty(value) ? value : undefined;
    this.searchControl = this.createSearchControl(value);
    this.options$ = this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value ? this.searchControl.value : ''),
        concatMap(val => this.onSearchValueChanged(val))
      );
  }

  removeFormControl(i: number) {
    this.control.markAllAsTouched();
    const formArray = this.control as FormArray;
    formArray.removeAt(i);
  }

  addFormControl(ontology: Ontology) {
    this.control.markAllAsTouched();
    const formArray = this.control as FormArray;
    const count = formArray.length;

    const formGroup: FormGroup = this.formHelper.toFormGroup(this.metadata.itemMetadata, ontology);
    formArray.insert(count, formGroup);
  }

  onSearchValueChanged(value: string | Ontology): Observable<Ontology[]> {
    const searchText = typeof value === 'string' ? value.toLowerCase() :
      value.ontology_label ? value.ontology_label.toLowerCase() : '';

    return this.ols.lookup(this.metadata.schema.items as JsonSchema, searchText);
  }

  onSelectAborted($event: any) {
    this.control.markAllAsTouched();
  }
}
