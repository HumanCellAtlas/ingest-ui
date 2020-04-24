import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {MetadataFormService} from './metadata-form.service';
import {JsonSchema} from './json-schema';
import {MetadataFormConfig} from './metadata-form-config';


@Component({
  selector: 'app-metadata-form',
  templateUrl: './metadata-form.component.html',
  styleUrls: ['./metadata-form.component.css']
})
export class MetadataFormComponent implements OnInit {
  @Input() name: string;

  @Input() schema: JsonSchema;

  @Input() layout: object;

  @Input() config: MetadataFormConfig;

  @Input() data: object;

  @Output() save = new EventEmitter<object>();

  form: FormGroup;

  formConfig: object = {};

  value: object;

  constructor(private metadataFormService: MetadataFormService) {

  }

  ngOnInit(): void {
    this.metadataFormService.initializeFormConfig( this.formConfig, 'project', this.schema, this.config);
    this.form = this.formConfig['project']['formControl'];
    // this.form.setValue(this.data);
  }

  onSubmit(e) {
    e.preventDefault();
    console.log('form data', this.form.value);
    console.log('$event', e);
    const formData = this.metadataFormService.cleanFormData(this.form.value);
    console.log('clean form data', formData );
    this.save.emit(formData);
  }

  removeFormControl(control: AbstractControl, i: number) {
    const formArray = control as FormArray;
    formArray.removeAt(i);
  }

  addFormControl(formControlName: string) {
    const config = this.formConfig[formControlName];
    const formArray = config['formControl'] as FormArray;
    const count = formArray.length;

    const formGroup: FormGroup = this.metadataFormService.toFormGroup(config['field']['schema']['items']);
    formArray.insert(count, formGroup);
  }
}
