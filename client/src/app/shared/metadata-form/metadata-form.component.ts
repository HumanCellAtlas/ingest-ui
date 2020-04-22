import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {MetadataFormService} from './metadata-form.service';
import {JsonSchema} from './json-schema';
import {JsonSchemaProperty} from './json-schema-property';
import {MetadataFormConfig} from './metadata-form-config';


@Component({
  selector: 'app-metadata-form',
  templateUrl: './metadata-form.component.html',
  styleUrls: ['./metadata-form.component.css']
})
export class MetadataFormComponent implements OnInit {
  @Input()
  name: string;

  @Input()
  schema: JsonSchema;

  @Input()
  layout: object;

  @Input()
  config: MetadataFormConfig;

  form: FormGroup;

  formConfig: object;

  propertiesMap: Map<string, JsonSchemaProperty>;

  payLoad = '';


  constructor(private metadataFormService: MetadataFormService) {
  }

  ngOnInit(): void {
    this.config = {
      ignoreFields: ['describedBy', 'schema_version'],
      removeEmptyFields: true
    };
    this.formConfig = this.metadataFormService.buildFormConfig('project', this.schema);
    this.form = this.formConfig['project']['formControl'];
    console.log('contributors', this.form.controls.contributors);
  }

  onSubmit() {
    console.log('form data', this.form.value);
    console.log('clean form data', this.metadataFormService.cleanFormData(this.form.value));
  }

  removeFormControl(control: AbstractControl, i: number) {
    const formArray = control as FormArray;
    formArray.removeAt(i);
  }

  // addFormControl(control: AbstractControl, ) {
  //   const formArray = control as FormArray;
  //   const count = formArray.length;
  //
  //   const newFormGroup: FormGroup = this.fb.group({
  //     firstName: ['', Validators.required],
  //     lastName: ['', Validators.required],
  //     email: ['', Validators.pattern(emailRegex)]
  //   })
  //
  //   usersArray.insert(arraylen, newUsergroup);
  // }
}
