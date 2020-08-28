import {Component, Input} from "@angular/core";

export interface FormItemData {

  label: string;
  helperText: string;
  disabled: boolean;
  isRequired: boolean;

}

@Component({
  selector: 'form-item',
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.css']
})
export class FormItemComponent {

  @Input()
  data: FormItemData;

  private _rootClass = <any> {
    "vf-form__item": true
  }

  @Input()
  get rootClass(): any {
    return this._rootClass;
  }

  set rootClass(rootClass: any) {
    Object.assign(this._rootClass, rootClass);
  }

}