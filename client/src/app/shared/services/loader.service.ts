import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoaderService {
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public message: BehaviorSubject<string> = new BehaviorSubject<string>('');

  display(value: boolean, message?: string) {
    this.status.next(value);
    this.message.next(message);
  }
}
