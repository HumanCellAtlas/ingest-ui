import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'concreteType'
})
export class ConcreteTypePipe implements PipeTransform {
  transform(json: object): string {
    let describedBy = json['describedBy'];

    if(!describedBy){
      return 'unknown';
    }

    let type = describedBy.split('/').pop();

    return type;
  }
}
