import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-metadata-field',
  templateUrl: './metadata-field.component.html',
  styleUrls: ['./metadata-field.component.css']
})

export class MetadataFieldComponent implements OnInit {

  @Input() value;
  @Input() metadataType;
  @Input() columnName;
  @Output() onValueChange = new EventEmitter();

  editMode: boolean = false;

  @Input() columnDefinition: object;

  constructor() {}

  ngOnInit() {}

  updateValue(event){
    this.editMode = false;

    let newValue;
    let type = this.columnDefinition['type'];

    console.log('columnDefinition', this.columnDefinition)

    if(type === 'string'){
      newValue = event.target.value;
    } else if(type === 'boolean'){
      newValue = event.target.checked;
    } else if(type === 'number'){
      newValue = Number(event.target.value);
    } else if(type === 'integer'){
      newValue = parseInt(event.target.value);
    }
    else {
      newValue = event.target.value;
    }

    console.log('event', event);
    this.value = newValue;

    this.onValueChange.emit(newValue);

  }

  stringify(value): string{

    let newValue = value;

    if(value instanceof Array && value.length > 0 && typeof value[0] !=='object') {
      newValue = value ? value.join(',') : '';
    }

    if (!(value instanceof Array) && typeof value === 'object'){
      newValue = JSON.stringify(value); //TODO list a column of that obj
    }


    return newValue;
  }


}
