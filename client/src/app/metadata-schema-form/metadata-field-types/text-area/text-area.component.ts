import {Component, OnInit} from '@angular/core';
import {Metadata} from '../../models/metadata';
import {AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.css']
})
export class TextAreaComponent implements OnInit {
  metadata: Metadata;
  control: AbstractControl;
  id: string;

  label: string;
  helperText: string;
  isRequired: boolean;
  error: string;
  example: string;
  disabled: boolean;
  rows: number;

  constructor() {
  }

  ngOnInit(): void {
    this.label = this.metadata.schema.user_friendly ? this.metadata.schema.user_friendly : this.metadata.key;
    this.helperText = this.metadata.schema.guidelines;
    this.isRequired = this.metadata.isRequired;
    this.example = this.metadata.schema.example;
    this.disabled = this.metadata.isDisabled;
    this.rows = 3;
  }

}
