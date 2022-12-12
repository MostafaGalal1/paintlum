import { Directive, HostListener, Input, SimpleChanges } from '@angular/core';
import Konva from 'konva';
import { DataService } from 'src/app/Services/data.service';
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
  @Input() upShape?:string;

  private stage?:Konva.Stage;
  private layer:Konva.Layer;
  private tr?:Konva.Transformer;
  private pad:number = 4;

  private selectionRectangle = new Konva.Rect({
    fill: 'rgba(0,125,255,0.5)',
    visible: false,
  });


  constructor(private dataService:DataService) {
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
    if (changes.hasOwnProperty('deleteShape')){
      if (this.deleteShape === "-1")
        return;
      this.konvaShape = this.stage?.findOne('#' + this.deleteShape!);
      this.konvaShape.destroy();
      this.tr?.destroy();
      this.layer.batchDraw();
      this.dataService.setDelete("-1");
    }

    if (changes.hasOwnProperty('updateShape')){
      let tmp = Konva.Node.create(this.updateShape!);
      this.konvaShape = this.stage?.findOne('#' + this.konvaShape.getAttr('id'));
      this.layer.add(tmp);
      this.konvaShape = tmp;
      this.layer.batchDraw();
    }

    if (changes.hasOwnProperty('upShape')){
        let tmp = Konva.Node.create(this.upShape!);
        this.konvaShape = this.stage?.findOne('#' + this.konvaShape.getAttr('id'));
        if (this.konvaShape !== undefined)
          this.konvaShape.destroy();
        this.layer.add(tmp);
        this.konvaShape = tmp;
        this.layer.batchDraw();
    }

    if (this.tr?.hasChildren()) {
      var update = false;
      if (this.konvaShape === this.tr?.nodes()[0]){
        update = true;
      }
      this.konvaShape = this.tr?.nodes()[0];
      this.konvaShape.setAttr("fill", this.fillColor);
      this.konvaShape.setAttr("stroke", this.strokeColor);
      this.konvaShape.setAttr("strokeWidth", parseInt(this.strokeWidth!));
      if (update){
        var pack: string;
        var un_data: any;
        un_data = {
            "updatedShape": this.konvaShape.toJSON()
        };

        pack =  Object.keys(un_data).map(function (key) { return [key, un_data[key]].map(encodeURIComponent).join("="); }).join("&");

        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.un_url + 'update' + '?' + pack, false);
        xhr.send();
      }
      this.layer.batchDraw();
    }
  }


  @HostListener('mousedown') onMouseDown() {
    var pos = this.stage?.getPointerPosition();
    if (this.tr?.hasChildren()) {
      if (this.tr !== undefined && !(pos!.x < (this.tr?.getX() - this.pad) || pos!.x > (this.tr?.getX() + this.tr?.getWidth() + this.pad) || pos!.y < (this.tr?.getY() - this.pad) || pos!.y > (this.tr?.getY() + this.tr?.getWidth() + this.pad))) {
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
      this.selectionRectangle.setAttrs({
        x: pos!.x,
        y: pos!.y,
        width: 1,
        height: 1,
      });
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
    }

    this.shapeDimension = false;
    this.shapeCreation = false;
    this.brush = false;
  }

  @HostListener('click') onMouseClick(){
    if (this.selection) {
      this.selectionRectangle.visible(false);
      var shapes = this.stage?.find('.shape');
      var box = this.selectionRectangle.getClientRect();
      var selected = shapes?.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      );

      this.tr?.nodes(selected!);
      if (this.tr?.nodes()[0] !== undefined){
        this.tr?.nodes([this.tr?.nodes()[0]]);
        this.fillColor = this.tr?.nodes()[0].getAttr('fill');
        this.strokeColor = this.tr?.nodes()[0].getAttr('stroke');
        this.strokeWidth = this.tr?.nodes()[0].getAttr('strokeWidth');
        this.dataService.setFillColor(this.fillColor!);
        this.dataService.setStrokeColor(this.strokeColor!);
        this.dataService.setsetstrokeWidth(this.strokeWidth!);
        this.layer.batchDraw();
      }
    }
    this.selection = false;
  }
}

