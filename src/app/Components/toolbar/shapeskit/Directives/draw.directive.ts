import { Directive, HostListener, Input } from '@angular/core';
import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Ellipse } from '../shapes/Ellipse';
import { Shape } from '../shapes/Shape';
import { ShapeFactory } from '../shapes/ShapeFactory';

@Directive({
  selector: '[appDraw]'
})
export class DrawDirective {
  factory:ShapeFactory;
  shape : any;
  konvaShape : any;
  shapeCreation : boolean = false;
  @Input() toDrawShape?:string;
  @Input() shapeColor?:string;

  private stage?:Konva.Stage;
  private layer:Konva.Layer;
  private tr?:Konva.Transformer;

  constructor() {
    Konva.autoDrawEnabled = false;
    this.factory = new ShapeFactory;
    this.layer = new Konva.Layer();
    this.stage = new Konva.Stage({
      container: "container",
      width: 960,
      height: 640});
    this.stage.add(this.layer);
  }

  @HostListener('mousedown') onMouseDown() {
    this.tr = new Konva.Transformer();
    this.shapeCreation = true;
    this.shape = this.factory.getShape(this.toDrawShape!);
    var pos = this.stage?.getPointerPosition();
    this.shape.x = pos!.x;
    this.shape.y = pos!.y;
    this.shape.fill = 'red';
    this.shape.stroke = 'black';
    this.shape.strokeWidth = 4;
    this.shape.draggable = true;
    this.konvaShape = this.shape.getKonva();
    this.layer?.add(this.konvaShape);
  }

  @HostListener('mousemove') onMouseMove() {
    if (!this.shapeCreation){
      return;
    }
    var pos = this.stage?.getPointerPosition();
    if (this.toDrawShape === "circle") {
      this.konvaShape.setAttr('radius', Math.sqrt(Math.abs((this.konvaShape.getAttr('x') - pos!.x) * (this.konvaShape.getAttr('x') - pos!.x) + (this.konvaShape.getAttr('y') - pos!.y) * (this.konvaShape.getAttr('y') - pos!.y))));
    } else if (this.toDrawShape === "ellipse") {
      this.konvaShape.setAttr('width', Math.abs(pos!.x - this.konvaShape.getAttr('x')));
      this.konvaShape.setAttr('height', Math.abs(pos!.y - this.konvaShape.getAttr('y')));
    } else if (this.toDrawShape === "square") {
      this.konvaShape.setAttr('width', Math.min(pos!.x - this.konvaShape.getAttr('x'), pos!.y - this.konvaShape.getAttr('y')));
      this.konvaShape.setAttr('height', Math.min(pos!.x - this.konvaShape.getAttr('x'), pos!.y - this.konvaShape.getAttr('y')));
    } else if (this.toDrawShape === "rectangle") {
      this.konvaShape.setAttr('width', pos!.x - this.konvaShape.getAttr('x'));
      this.konvaShape.setAttr('height', pos!.y - this.konvaShape.getAttr('y'));
    }
    this.layer.batchDraw();
  }

  @HostListener('mouseup') onMouseUp() {
    this.shapeCreation = false;
  }
}
