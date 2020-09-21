import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MetadataFormService} from '../metadata-form.service';
import {JsonSchema} from '../models/json-schema';
import {MetadataFormConfig} from '../models/metadata-form-config';
import {MetadataForm} from '../models/metadata-form';
import {LoaderService} from '../../shared/services/loader.service';
import {MetadataFormTab} from "../models/metadata-form-layout";

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

  @Input() selectedTabIndex = 0;

  @Output() save = new EventEmitter<object>();

  @Output() cancel = new EventEmitter<boolean>();

  @Output() reset = new EventEmitter<boolean>();

  @Output() back = new EventEmitter<boolean>();

  @Output() tabChange = new EventEmitter<number>();

  formGroup: FormGroup;

  metadataForm: MetadataForm;

  form: object = {};

  value: object;

  done: boolean;

  constructor(private metadataFormService: MetadataFormService,
              private loaderService: LoaderService) {
  }

  ngOnInit(): void {
    this.metadataForm = this.metadataFormService.createForm(this.schema.name, this.schema, this.data, this.config);
    this.formGroup = this.metadataForm.formGroup;
    this.done = true;
  }

  showTab(tab: MetadataFormTab): boolean {
    if (this.config.viewMode && this.config.removeEmptyFields && tab.items.length == 1) {
      if (tab.key == tab.items[0]) {
        let data = this.data;
        let chain = true;

        let keys = tab.key.replace('project.', '').split('.')
        for (const key of keys) {
          if ((key in data)) {
            data = data[key];
          } else {
            chain = false;
            break;
          }
        }
        return chain;
      }
    }
    return true;
  }

  visibleTabs(tabs: MetadataFormTab[]): number {
    let visibleTabs: number = 0;
    for (const tab of tabs) {
      if (this.showTab(tab)) {
        visibleTabs++;
      }
    }
    return visibleTabs;
  }

  onSubmit(e) {
    e.preventDefault();
    const formValue = this.metadataForm.formGroup.getRawValue();
    const formData = this.metadataFormService.cleanFormData(formValue);
    console.log('clean form data', formData);
    console.log('form valid?', this.formGroup.valid);
    console.log('form group', this.formGroup);

    if (this.selectedTabIndex === this.config.layout.tabs.length - 1) {
      this.formGroup.markAllAsTouched();
    }

    this.save.emit({
      value: formData,
      valid: this.formGroup.valid
    });

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

  onBack($event: MouseEvent) {
    this.back.emit();
  }

  onReset($event: MouseEvent) {
    this.reset.emit();
  }
}
