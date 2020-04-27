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

  @Output() cancel = new EventEmitter<boolean>();

  formGroup: FormGroup;

  form: object = {};

  value: object;

  done: boolean;

  constructor(private metadataFormService: MetadataFormService) {
  }

  ngOnInit(): void {
    // this.form = this.metadataFormService.buildForm('project', this.schema, this.data, this.config);
    this.metadataFormService.initializeFormConfig(this.form, 'project', this.schema, this.config, this.data);
    this.done = true;
    console.log('form config', this.form);
    this.formGroup = this.form['project']['formControl'];
  }

  onSubmit(e) {
    e.preventDefault();
    console.log('form data', this.formGroup.value);
    const formData = this.metadataFormService.cleanFormData(this.formGroup.value);
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
    const config = this.form[formControlName];
    const formArray = config['formControl'] as FormArray;
    const count = formArray.length;

    const formGroup: FormGroup = this.metadataFormService.toFormGroup(config['field']['schema']['items']);
    formArray.insert(count, formGroup);
  }

  confirmCancel(e) {
    if (confirm('Are you sure you want to cancel?')) {
      this.cancel.emit(e);
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}
