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
  brush : boolean = false;
  shapeCreation : boolean = false;
  @Input() toDrawShape?:string;
  @Input() toColorShape?:string;
  @Input() fillColor?:string;
  @Input() thickness?:string;

  private stage?:Konva.Stage;
  private layer:Konva.Layer;
  private tr?:Konva.Transformer;

  constructor() {
    Konva.autoDrawEnabled = false;
    this.factory = new ShapeFactory;
    this.layer = new Konva.Layer();
    this.stage = new Konva.Stage({
      container: "container",
      width: 1600,
      height: 880});
    this.stage.add(this.layer);
  }

  @HostListener('mousedown') onMouseDown() {
    if (this.tr?.hasChildren()) {
      return;
    }
    this.tr = new Konva.Transformer();
    var pos = this.stage?.getPointerPosition();
    if (this.toDrawShape !== "brush"){
      this.shapeCreation = true;
      this.shape = this.factory.getShape(this.toDrawShape!);
      this.shape.x = pos!.x;
      this.shape.y = pos!.y;
      this.shape.fill = this.fillColor;
      this.shape.stroke = this.toColorShape;
      this.shape.draggable = true;
      this.shape.strokeWidth = parseInt(this.thickness!);
      this.konvaShape = this.shape.getKonva();
    } else {
      this.brush = true;
      this.konvaShape = new Konva.Line({
        points: [pos!.x, pos!.y, pos!.x, pos!.y],
        stroke: this.fillColor,
        strokeWidth: parseInt(this.thickness!),
        lineCap: 'round',
        lineJoin: 'round',
        draggable: true,
      });
    }
    this.layer?.add(this.konvaShape);
    this.layer?.add(this.tr);
  }

  @HostListener('mousemove') onMouseMove() {

    var pos = this.stage?.getPointerPosition();
    if (!this.shapeCreation && !this.brush){
      return;
    }
    if (this.shapeCreation){
      if (this.toDrawShape === "circle" || this.toDrawShape === "triangle") {
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
    } else {
      var newPoints = this.konvaShape.points().concat([pos!.x, pos!.y]);
      this.konvaShape.points(newPoints);
    }
    this.layer.batchDraw();
  }

  @HostListener('mouseup') onMouseUp(){
    this.tr?.nodes([this.konvaShape]);
    this.shapeCreation = false;
    this.brush = false;
  }

  @HostListener("dblclick") ondblclick() {
    this.tr?.destroy();
    this.konvaShape.draggable(false);
  }
}

