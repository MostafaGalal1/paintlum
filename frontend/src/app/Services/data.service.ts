import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  value = new BehaviorSubject('brush');
  value$ = this.value.asObservable();
  color = new BehaviorSubject('#FFFFFF');
  color$ = this.color.asObservable();
  fillColor = new BehaviorSubject('transparent');
  fillColor$ = this.fillColor.asObservable();
  thickness = new BehaviorSubject('5');
  thickness$ = this.thickness.asObservable();

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

  getFillColor():Observable<string> {
    return this.fillColor$;
  }

  setFillColor(col : string) {
    this.fillColor.next(col);
  }

  getThickness(): Observable<string>{
      return this.thickness$;
  }

  setThickness(thickness : string) {
      this.thickness.next(thickness);
  }

}
