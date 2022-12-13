import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  Shape = new BehaviorSubject('');
  Shape$ = this.Shape.asObservable();
  upShape = new BehaviorSubject('');
  upShape$ = this.upShape.asObservable();
  ColorIT = new BehaviorSubject(false);
  ColorIT$ = this.ColorIT.asObservable();
  removeShape = new BehaviorSubject(false);
  removeShape$ = this.removeShape.asObservable();
  konvaShape = new BehaviorSubject('');
  konvaShape$ = this.konvaShape.asObservable();
  delete = new BehaviorSubject('-1');
  delete$ = this.delete.asObservable();
  value = new BehaviorSubject('brush');
  value$ = this.value.asObservable();
  strokeColor = new BehaviorSubject('#000000');
  strokeColor$ = this.strokeColor.asObservable();
  fillColor = new BehaviorSubject('transparent');
  fillColor$ = this.fillColor.asObservable();
  strokeWidth = new BehaviorSubject("5");
  strokeWidth$ = this.strokeWidth.asObservable();

  constructor() {}

  getValue():Observable<string> {
    return this.value$;
  }

  setValue(val : string) {
    this.value.next(val);
  }

  getColorIt():Observable<boolean> {
    return this.ColorIT$;
  }

  setColorIt(val : boolean) {
    this.ColorIT.next(val);
  }

  getRemove():Observable<boolean> {
    return this.removeShape$;
  }

  setRemove(val : boolean) {
    this.removeShape.next(val);
  }

  getShape():Observable<string> {
    return this.Shape$;
  }

  setShape(und : string) {
    this.Shape.next(und);
  }

  getUpShape():Observable<string>{
      return this.upShape$;
  }

  setUpShape(upShape : string) {
      this.upShape.next(upShape);
  }

  getKonvaShape():Observable<string> {
    return this.Shape$;
  }

  setKonvaShape(und : string) {
    this.Shape.next(und);
  }

  getDelete():Observable<string> {
    return this.delete$;
  }

  setDelete(del : string) {
    this.delete.next(del);
  }

  getStrokeColor():Observable<string> {
    return this.strokeColor$;
  }

  setStrokeColor(sCl : string) {
    this.strokeColor.next(sCl);
  }

  getFillColor():Observable<string> {
    return this.fillColor$;
  }

  setFillColor(fCl : string) {
    this.fillColor.next(fCl);
  }

  getStrokeWidth(): Observable<string>{
      return this.strokeWidth$;
  }

  setsetstrokeWidth(stW : string) {
      this.strokeWidth.next(stW);
  }
}
