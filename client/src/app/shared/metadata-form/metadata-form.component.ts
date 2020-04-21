import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MetadataFormService} from './metadata-form.service';
import {JsonSchema} from './json-schema';
import * as jsonSchema from './test-json-schema.json';
import {JsonSchemaProperty} from "./json-schema-property";
import {JsonSchemaFormConfig} from "./json-schema-form-config";

@Component({
  selector: 'app-metadata-form',
  templateUrl: './metadata-form.component.html',
  styleUrls: ['./metadata-form.component.css']
})
export class MetadataFormComponent implements OnInit {

  @Input()
  schema: JsonSchema;

  @Input()
  layout: object;

  @Input()
  config: JsonSchemaFormConfig;

  form: FormGroup;

  propertiesMap: Map<string, JsonSchemaProperty>;

  payLoad = '';

  constructor(private metadataFormService: MetadataFormService) {
  }

  ngOnInit(): void {
    this.config = {
      ignoreFields: ['describedBy', 'schema_version'],
      removeEmptyFields: true
    };
    this.schema = (jsonSchema as any).default;
    this.form = this.metadataFormService.toFormGroup(this.schema);
  }

  onSubmit() {
    console.log('form data', this.form.value);
    console.log('clean form data', this.metadataFormService.cleanFormData(this.form.value));
  }
}
