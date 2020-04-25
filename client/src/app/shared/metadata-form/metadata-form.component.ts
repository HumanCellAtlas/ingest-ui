import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {MetadataFormService} from './metadata-form.service';
import {JsonSchema} from './json-schema';
import {MetadataFormConfig} from './metadata-form-config';
import {Router} from "@angular/router";


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

  done: boolean;

  constructor(private metadataFormService: MetadataFormService, private router: Router) {

  }

  ngOnInit(): void {
    this.metadataFormService.initializeFormConfig(this.formConfig, 'project', this.schema, this.config, this.data);
    this.done = true;
    console.log('form config', this.formConfig);
    this.form = this.formConfig['project']['formControl'];
  }

  onSubmit(e) {
    e.preventDefault();
    console.log('form data', this.form.value);
    const formData = this.metadataFormService.cleanFormData(this.form.value);
    console.log('clean form data', formData);
    this.save.emit(formData);
  }

  removeFormControl(control: AbstractControl, i: number) {
    if (confirm('Are you sure?')) {
      const formArray = control as FormArray;
      formArray.removeAt(i);
    }

  }

  addFormControl(formControlName: string) {
    const config = this.formConfig[formControlName];
    const formArray = config['formControl'] as FormArray;
    const count = formArray.length;

    const formGroup: FormGroup = this.metadataFormService.toFormGroup(config['field']['schema']['items']);
    formArray.insert(count, formGroup);
  }

  confirmCancel(e) {
    if (confirm('Are you sure you want to cancel?')) {
      this.router.navigate(['/projects']);
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}
