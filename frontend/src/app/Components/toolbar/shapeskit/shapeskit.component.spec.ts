import { Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeskitComponent } from './shapeskit.component';

describe('ShapeskitComponent', () => {
  let component: ShapeskitComponent;
  let fixture: ComponentFixture<ShapeskitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShapeskitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapeskitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
