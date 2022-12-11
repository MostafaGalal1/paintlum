import { Directive, HostListener, Input, SimpleChanges } from '@angular/core';
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
  shapeDimension : boolean = false;
  selection : boolean = false;
  un_url: string = "http://localhost:8080/paint/";

  @Input() selectedShape?:string;
  @Input() strokeColor?:string;
  @Input() fillColor?:string;
  @Input() strokeWidth?:string;
  @Input() updateShape?:string;
  @Input() deleteShape?:string;

  private stage?:Konva.Stage;
  private layer:Konva.Layer;
  private tr?:Konva.Transformer;
  private pad:number = 4;
  private x1?:number; y1?:number; x2?:number; y2?:number;

  private selectionRectangle = new Konva.Rect({
    fill: 'rgba(0,125,255,0.5)',
    visible: false,
  });


  constructor() {
    Konva.autoDrawEnabled = false;
    this.factory = new ShapeFactory;
    this.layer = new Konva.Layer();
    this.layer.add(this.selectionRectangle);
    this.stage = new Konva.Stage({
      container: "container",
      width: 1600,
      height: 880});
    this.stage.add(this.layer);
  }

  ngOnChanges(changes: SimpleChanges){
    console.log(changes);
    if (changes.hasOwnProperty('deleteShape')){
      this.konvaShape = this.stage?.findOne('#' + this.deleteShape!);
      this.konvaShape.destroy();
      this.tr?.destroy();
      this.layer.batchDraw();
    }

    if (changes.hasOwnProperty('updateShape')){
      var tmp = Konva.Node.create(this.updateShape!);
      this.stage?.findOne('#' + this.konvaShape.getAttr('id'));
      this.konvaShape = tmp;
      this.layer.add(this.konvaShape);
      this.layer.batchDraw();
    }

    if (this.tr?.hasChildren()) {
        this.konvaShape.setAttr("fill", this.fillColor);
        this.konvaShape.setAttr("stroke", this.strokeColor);
        this.konvaShape.setAttr("strokeWidth", parseInt(this.strokeWidth!));
        this.layer.batchDraw();
    }
  }


  @HostListener('mousedown') onMouseDown() {
    var pos = this.stage?.getPointerPosition();
    console.log(this.tr?.getWidth() + " " + this.tr?.getHeight());
    console.log(this.tr?.getX() + " " + this.tr?.getY());
    if (this.tr?.hasChildren()) {
      if (this.tr !== undefined && !(pos!.x < (this.tr?.getX() - this.pad) || pos!.x > (this.tr?.getX() + this.tr?.getWidth() + this.pad) || pos!.y < (this.tr?.getY() - this.pad) || pos!.y > (this.tr?.getY() + this.tr?.getWidth() + this.pad))) {
        var pack: string;
    var un_data: any;
    un_data = {
        "ShapeData": this.konvaShape.toJSON()
    };

    pack =  Object.keys(un_data).map(function (key) { return [key, un_data[key]].map(encodeURIComponent).join("="); }).join("&");

    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.un_url + 'update' + '?' + pack, false);
    xhr.send();
        return;
      } else {
        this.tr.destroy();
        this.konvaShape.draggable(false);
      }
    }

    this.tr = new Konva.Transformer({
      anchorStroke: 'grey',
      anchorFill: 'white',
      anchorSize: 7,
      borderStroke: 'black',
      borderDash: [3, 3],
      shouldOverdrawWholeArea: true,
    });
    this.layer.add(this.tr);

    if (this.selectedShape === "brush"){
      this.shapeDimension = true;
      this.brush = true;
      this.konvaShape = new Konva.Line({
        name: 'shape',
        points: [pos!.x, pos!.y, pos!.x, pos!.y],
        stroke: this.strokeColor,
        strokeWidth: parseInt(this.strokeWidth!),
        lineCap: 'round',
        lineJoin: 'round',
        draggable: true,
      });

      this.layer?.add(this.konvaShape);
      this.layer?.add(this.tr);
    } else if (this.selectedShape === "select"){
      this.selection = true;

      this.x1 = pos!.x;
      this.y1 = pos!.y;
      this.x2 = pos!.x;
      this.y2 = pos!.y;

      this.selectionRectangle.visible(true);
      this.selectionRectangle.width(0);
      this.selectionRectangle.height(0);
    } else {
      this.shapeCreation = true;
      this.shape = this.factory.getShape(this.selectedShape!);
      this.shape.x = pos!.x;
      this.shape.y = pos!.y;
      this.shape.fill = this.fillColor;
      this.shape.stroke = this.strokeColor;
      this.shape.draggable = true;
      this.shape.strokeWidth = parseInt(this.strokeWidth!);
      this.konvaShape = this.shape.getKonva();

      this.layer?.add(this.konvaShape);
      this.layer?.add(this.tr);
    }
  }

  @HostListener('mousemove') onMouseMove() {
    var pos = this.stage?.getPointerPosition();
    if (!this.shapeCreation && !this.brush && !this.selection){
      return;
    }

    this.shapeDimension = true;
    if (this.shapeCreation){
      if (this.selectedShape === "circle" || this.selectedShape === "triangle" || this.selectedShape === "diamond" || this.selectedShape === "pentagon" || this.selectedShape === "hexagon") {
        this.konvaShape.setAttr('radius', Math.sqrt(Math.abs((this.konvaShape.getAttr('x') - pos!.x) * (this.konvaShape.getAttr('x') - pos!.x) + (this.konvaShape.getAttr('y') - pos!.y) * (this.konvaShape.getAttr('y') - pos!.y))));
      } else if (this.selectedShape === "diamond_star" || this.selectedShape === "penta_star" || this.selectedShape === "hexa_star") {
        this.konvaShape.setAttr('innerRadius', Math.sqrt(Math.abs((this.konvaShape.getAttr('x') - pos!.x) * (this.konvaShape.getAttr('x') - pos!.x) + (this.konvaShape.getAttr('y') - pos!.y) * (this.konvaShape.getAttr('y') - pos!.y))));
        this.konvaShape.setAttr('outerRadius', this.konvaShape.getAttr('innerRadius') *  10 / (this.konvaShape.getAttr('numPoints') - 1));
      } else if (this.selectedShape === "ellipse") {
        this.konvaShape.setAttr('width', Math.abs(pos!.x - this.konvaShape.getAttr('x')));
        this.konvaShape.setAttr('height', Math.abs(pos!.y - this.konvaShape.getAttr('y')));
      } else if (this.selectedShape === "square") {
        this.konvaShape.setAttr('width', Math.min(pos!.x - this.konvaShape.getAttr('x'), pos!.y - this.konvaShape.getAttr('y')));
        this.konvaShape.setAttr('height', Math.min(pos!.x - this.konvaShape.getAttr('x'), pos!.y - this.konvaShape.getAttr('y')));
      } else if (this.selectedShape === "rectangle") {
        this.konvaShape.setAttr('width', pos!.x - this.konvaShape.getAttr('x'));
        this.konvaShape.setAttr('height', pos!.y - this.konvaShape.getAttr('y'));
      }
    } else if (this.brush) {
      var newPoints = this.konvaShape.points().concat([pos!.x, pos!.y]);
      this.konvaShape.points(newPoints);
    } else if (this.selection) {
      this.x2 = pos!.x;
      this.y2 = pos!.y;

      this.selectionRectangle.setAttrs({
        x: Math.min(this.x1!, this.x2!),
        y: Math.min(this.y1!, this.y2!),
        width: Math.abs(this.x2! - this.x1!),
        height: Math.abs(this.y2! - this.y1!),
      });
    }
    this.layer.batchDraw();
  }

  @HostListener('mouseup') onMouseUp(){
    if (this.shapeDimension) {
      this.tr?.nodes([this.konvaShape]);
      var pack: string;
      var un_data: any;
      un_data = {
          "ShapeData": this.konvaShape.toJSON()
      };

      pack =  Object.keys(un_data).map(function (key) { return [key, un_data[key]].map(encodeURIComponent).join("="); }).join("&");

      var xhr = new XMLHttpRequest();
      xhr.open("GET", this.un_url + 'create' + '?' + pack, false);
      xhr.send();
      console.log(xhr.response);
      this.konvaShape.setAttr('id', xhr.response);
    } if (this.selection) {
      this.selectionRectangle.visible(false);
      var shapes = this.stage?.find('.shape');
      var box = this.selectionRectangle.getClientRect();
      var selected = shapes?.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      );

      this.tr?.nodes(selected!);
      this.layer.batchDraw();
    }

    this.shapeDimension = false;
    this.shapeCreation = false;
    this.selection = false;
    this.brush = false;
  }
}

