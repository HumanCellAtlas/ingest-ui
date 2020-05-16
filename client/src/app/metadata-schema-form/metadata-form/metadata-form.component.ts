import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MetadataFormService} from '../metadata-form.service';
import {JsonSchema} from '../models/json-schema';
import {MetadataFormConfig} from '../models/metadata-form-config';
import {MetadataForm} from '../models/metadata-form';

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

  @Input() selectedTabIndex: number = 0;

  @Output() save = new EventEmitter<object>();

  @Output() cancel = new EventEmitter<boolean>();

  @Output() tabChange = new EventEmitter<number>();

  formGroup: FormGroup;

  metadataForm: MetadataForm;

  form: object = {};

  value: object;

  done: boolean;

  constructor(private metadataFormService: MetadataFormService) {
  }

  ngOnInit(): void {
    this.metadataForm = this.metadataFormService.createForm('project', this.schema, this.data, this.config);
    console.log('metadataForm', this.metadataForm);
    this.formGroup = this.metadataForm.formGroup;
    this.done = true;

  }

  onSubmit(e) {
    e.preventDefault();
    const formData = this.metadataFormService.cleanFormData(this.metadataForm.formGroup.value);
    console.log('clean form data', formData);
    this.save.emit(formData);
  }

  confirmCancel(e) {
    if (confirm('Are you sure you want to cancel?')) {
      this.cancel.emit(e);
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  onSelectedIndexChange(tabIndex: number) {
    this.tabChange.emit(tabIndex);
  }

}
