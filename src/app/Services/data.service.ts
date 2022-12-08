import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ValueFromArray } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  value = new BehaviorSubject('brush');
  value$ = this.value.asObservable();
  color = new BehaviorSubject('#ffffff');
  color$ = this.color.asObservable();

  constructor() {}

  getValue():Observable<string> {
    return this.value$;
  }

  setValue(val : string) {
    this.value.next(val);
  }

  getColor():Observable<string> {
    return this.color$;
  }

  setColor(col : string) {
    this.color.next(col);
  }
}
