import { Directive, ChangeDetectorRef, HostListener, Input, SimpleChanges } from '@angular/core';
import Konva from 'konva';
import { DataService } from 'src/app/Services/data.service';
import { ShapeFactory } from '../shapes/ShapeFactory';

@Directive({
  selector: '[appDraw]'
})
export class DrawDirective {
  factory : ShapeFactory;
  shape : any;
  copyShape : any;
  copying: boolean = false;
  sendScale : boolean = false;
  sendCoordinate : boolean = false;
  konvaShape : any;
  brush : boolean = false;
  shapeCreation : boolean = false;
  shapeDimension : boolean = false;
  selection : boolean = false;
  API_url: string = "http://localhost:8080/paint/";

  @Input() selectedShape?:string;
  @Input() strokeColor?:string;
  @Input() loading?: string[];
  @Input() sendColor?:boolean;
  @Input() fillColor?:string;
  @Input() removeShape?:boolean;
  @Input() strokeWidth?:string;
  @Input() updateShape?:string;
  @Input() deleteShape?:string;
  @Input() upShape?:string;

  private stage?:Konva.Stage;
  private readonly layer:Konva.Layer;
  private readonly tr?:Konva.Transformer;
  private readonly selectionRectangle?:Konva.Rect;
  private pad:number = 4;

  constructor(private dataService:DataService) {
    Konva.autoDrawEnabled = false;
    this.factory = new ShapeFactory;

    this.selectionRectangle = new Konva.Rect({
      width: 1,
      height: 1,
      visible: false,
    });

    this.tr = new Konva.Transformer({
      anchorStroke: 'grey',
      anchorFill: 'white',
      anchorSize: 7,
      borderStroke: 'black',
      borderDash: [3, 3],
      shouldOverdrawWholeArea: true,
    });

    this.stage = new Konva.Stage({
      container: "container",
      width: 1600,
      height: 880
    });
    this.layer = new Konva.Layer();
    this.tr = new Konva.Transformer({
      anchorStroke: 'grey',
      anchorFill: 'white',
      anchorSize: 7,
      borderStroke: 'black',
      borderDash: [3, 3],
      shouldOverdrawWholeArea: true,
    });

    this.layer.add(this.selectionRectangle);
    this.layer.add(this.tr);
    this.stage.add(this.layer);
  }

  ngOnChanges(changes: SimpleChanges){
    let pack: string;
    let un_data: any;
    if (changes.hasOwnProperty('loading')){
      if (this.loading?.join() === "")
        return;
      for(let sh of this.loading!){
        sh = '{' + sh;
        let tmp = Konva.Node.create(sh);
        tmp.setAttr('name', 'shape');
        this.layer.add(tmp);
        this.tr?.nodes([tmp]);
        this.fillColor = this.tr?.nodes()[0].getAttr('fill');
        this.strokeColor = this.tr?.nodes()[0].getAttr('stroke');
        this.strokeWidth = this.tr?.nodes()[0].getAttr('strokeWidth');
      }
      setTimeout(() => {
        this.dataService.setLoadFile(['']);
      });
    }

    else if (changes.hasOwnProperty('removeShape')){
      setTimeout(() => {
        this.dataService.setRemove(false);
      });
      if (this.tr?.nodes()[0] !== undefined) {
        un_data = {"ID": this.tr?.nodes()[0].getAttr('id')};
        this.tr?.nodes()[0].destroy();

        pack =  Object.keys(un_data).map(function (key) { return [key, un_data[key]].map(encodeURIComponent).join("="); }).join("&");

        let xhr = new XMLHttpRequest();
        xhr.open("POST", this.API_url + 'delete' + '?' + pack, false);
        xhr.send();
        this.tr?.nodes([]);
        this.layer.batchDraw();
      }
    } else if (changes.hasOwnProperty('deleteShape')){
      if (this.deleteShape === "-1")
        return;
      this.stage?.findOne('#' + this.deleteShape!).remove();
      this.tr?.nodes([]);
      this.layer.batchDraw();
      setTimeout(() => {
        this.dataService.setDelete("-1");
      });
    }


    else if (changes.hasOwnProperty('updateShape')){
      let tmp = Konva.Node.create(this.updateShape!);
      tmp.setAttr('name', 'shape');
      this.layer.add(tmp);
      this.tr?.nodes([tmp]);
      this.fillColor = this.tr?.nodes()[0].getAttr('fill');
      this.strokeColor = this.tr?.nodes()[0].getAttr('stroke');
      this.strokeWidth = this.tr?.nodes()[0].getAttr('strokeWidth');
    }

    else if (changes.hasOwnProperty('upShape')){
        if (this.upShape === '')
          return;
        let tmp = Konva.Node.create(this.upShape!);
        this.layer?.findOne('#' + tmp.getAttr('id')).destroy();
        tmp.setAttr('name', 'shape');
        this.layer.add(tmp);
        this.tr?.nodes([tmp]);
        this.fillColor = this.tr?.nodes()[0].getAttr('fill');
        this.strokeColor = this.tr?.nodes()[0].getAttr('stroke');
        this.strokeWidth = this.tr?.nodes()[0].getAttr('strokeWidth');
        this.dataService.setFillColor(this.fillColor!);
        this.dataService.setStrokeColor(this.strokeColor!);
        this.dataService.setsetstrokeWidth(this.strokeWidth!);
        this.layer.batchDraw();
        setTimeout(() => {
          this.dataService.setUpShape('');
        });
    } else if (this.tr?.nodes()[0] !== undefined) {
      this.tr?.nodes()[0].setAttr("fill", this.fillColor);
      this.tr?.nodes()[0].setAttr("stroke", this.strokeColor);
      this.tr?.nodes()[0].setAttr("strokeWidth", parseInt(this.strokeWidth!));
      this.layer.batchDraw();

      if (!this.sendColor)
        return;

      setTimeout(() => {
        this.dataService.setColorIt(false);
      });

      un_data = {"key": "style", "updatedShape": this.tr?.nodes()[0].toJSON()};

      pack =  Object.keys(un_data).map(function (key) { return [key, un_data[key]].map(encodeURIComponent).join("="); }).join("&");

      let xhr = new XMLHttpRequest();
      xhr.open("POST", this.API_url + 'update' + '?' + pack, false);
      xhr.send();
    }
  }


  @HostListener('mousedown') onMouseDown() {
    let pos = this.stage?.getPointerPosition();
    if (this.tr?.nodes()[0] !== undefined) {
      if (this.tr !== undefined && !(pos!.x < (this.tr?.getX() - this.pad) || pos!.x > (this.tr?.getX() + this.tr?.getWidth() + this.pad) || pos!.y < (this.tr?.getY() - this.pad) || pos!.y > (this.tr?.getY() + this.tr?.getWidth() + this.pad))) {
        return;
      } else {
        this.copyShape = Konva.Node.create(this.tr?.nodes()[0]);
        this.tr?.nodes()[0].draggable(false);
        this.tr.nodes([]);
        this.layer.batchDraw();
      }
    }

    if (this.selectedShape === "brush" || this.selectedShape === "line_segment"){
      this.shapeDimension = true;
      this.brush = true;
      this.konvaShape = new Konva.Line({
        name: 'shape',
        points: [pos!.x, pos!.y, pos!.x, pos!.y],
        stroke: this.strokeColor,
        strokeWidth: parseInt(this.strokeWidth!),
        scaleX: 1,
        scaleY: 1,
        lineCap: 'round',
        lineJoin: 'round',
        draggable: true,
      });
      this.layer?.add(this.konvaShape);
    } else if (this.selectedShape === "eraser") {
        this.shapeDimension = true;
        this.brush = true;
        this.konvaShape = new Konva.Line({
            name: 'shape',
            points: [pos!.x, pos!.y, pos!.x, pos!.y],
            stroke: "white",
            strokeWidth: parseInt(this.strokeWidth!),
            lineCap: 'round',
            lineJoin: 'round',
            draggable: false,
        });
        this.layer?.add(this.konvaShape);
    } else if (this.selectedShape === "select"){
      this.selection = true;
      this.selectionRectangle!.setAttrs({
        x: pos!.x,
        y: pos!.y,
      });
    } else if (this.selectedShape === "copy"){
      this.copying = true;
    } else {
      this.shapeCreation = true;
      this.shape = this.factory.getShape(this.selectedShape!);
      this.shape.x = pos!.x;
      this.shape.y = pos!.y;
      this.shape.fill = this.fillColor;
      this.shape.stroke = this.strokeColor;
      this.shape.draggable = true;
      this.shape.scaleX = 1;
      this.shape.scaleY = 1;
      this.shape.strokeWidth = parseInt(this.strokeWidth!);
      this.konvaShape = this.shape.getKonva();
      this.layer?.add(this.konvaShape);
    }
  }

  @HostListener('mousemove') onMouseMove() {
    let pos = this.stage?.getPointerPosition();
    if (this.tr?.nodes()[0] !== undefined){
      this.tr?.nodes()[0].on('scaleXChange scaleYChange', () => {
        this.sendScale = true;
      });
      this.tr?.nodes()[0].on('xChange yChange', () => {
        this.sendCoordinate = true;
      });
    }

    if (!this.shapeCreation && !this.brush && !this.selection && !this.copying){
      return;
    }

    if (this.shapeCreation){
      this.shapeDimension = true;
      if (this.selectedShape === "circle" || this.selectedShape === "triangle" || this.selectedShape === "diamond" || this.selectedShape === "pentagon" || this.selectedShape === "hexagon") {
        this.konvaShape.setAttr('radius', Math.sqrt(Math.abs((this.konvaShape.getAttr('x') - pos!.x) * (this.konvaShape.getAttr('x') - pos!.x) + (this.konvaShape.getAttr('y') - pos!.y) * (this.konvaShape.getAttr('y') - pos!.y))));
      } else if (this.selectedShape === "diamond_star" || this.selectedShape === "penta_star" || this.selectedShape === "hexa_star") {
        this.konvaShape.setAttr('innerRadius', Math.sqrt(Math.abs((this.konvaShape.getAttr('x') - pos!.x) * (this.konvaShape.getAttr('x') - pos!.x) + (this.konvaShape.getAttr('y') - pos!.y) * (this.konvaShape.getAttr('y') - pos!.y))));
        this.konvaShape.setAttr('outerRadius', this.konvaShape.getAttr('innerRadius') * 10 / (this.konvaShape.getAttr('numPoints') - 1));
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
        let newPoints
        if (this.selectedShape === "brush" || this.selectedShape === "eraser") {
            newPoints = this.konvaShape.points().concat([pos!.x, pos!.y]);
            this.konvaShape.points(newPoints);
        }
        else if (this.selectedShape === "line_segment") {
            newPoints = [this.konvaShape.points()[0], this.konvaShape.points()[1], pos!.x, pos!.y];
            this.konvaShape.points(newPoints);
        }
    }

    this.layer.batchDraw();
  }

  @HostListener('mouseup') onMouseUp() {
    if (this.shapeDimension) {
      if (this.selectedShape !== "eraser")
        this.tr?.nodes([this.konvaShape]);
      let un_data : any = {
          "ShapeData": this.tr?.nodes()[0].toJSON()
      };
      let pack =  Object.keys(un_data).map(function (key) { return [key, un_data[key]].map(encodeURIComponent).join("="); }).join("&");

      let xhr = new XMLHttpRequest();
      xhr.open("GET", this.API_url + 'create' + '?' + pack, false);
      xhr.send();
      this.tr?.nodes()[0].setAttr('id', xhr.response);
    } else if (this.selection) {
      let shapes = this.stage?.find('.shape');
      let box = this.selectionRectangle!.getClientRect();
      let selected = shapes?.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      );

      if (selected![0] !== undefined){
        this.tr?.nodes([selected![0]]);
        this.tr?.nodes()[0].draggable(true);
        this.fillColor = this.tr?.nodes()[0].getAttr('fill');
        this.strokeColor = this.tr?.nodes()[0].getAttr('stroke');
        this.strokeWidth = this.tr?.nodes()[0].getAttr('strokeWidth');
        this.dataService.setFillColor(this.fillColor!);
        this.dataService.setStrokeColor(this.strokeColor!);
        this.dataService.setsetstrokeWidth(this.strokeWidth!);
        this.layer.batchDraw();
      }
      this.selection = false;
    } else if (this.copying){
      let pos = this.stage?.getPointerPosition();
        let tmp = this.copyShape;
        tmp.setAttrs({x: pos!.x, y: pos!.y});
        this.layer.add(tmp);
        this.tr?.nodes([tmp]);
        this.layer.batchDraw();
        this.copying = false;
    } else if (this.sendScale){
      let un_data : any = {"key": "scale", "updatedShape": this.tr?.nodes()[0].toJSON()};

      let pack =  Object.keys(un_data).map(function (key) { return [key, un_data[key]].map(encodeURIComponent).join("="); }).join("&");

      let xhr = new XMLHttpRequest();
      console.log(this.tr?.nodes()[0].toJSON());
      console.log(un_data);
      xhr.open("POST", this.API_url + 'update' + '?' + pack, false);
      xhr.send();
      this.sendScale = false;
      this.sendCoordinate = false;
    } else if (this.sendCoordinate){
      let pack: string;
      let un_data: any;
      un_data = {"key":"move", "updatedShape": this.tr?.nodes()[0].toJSON()};

      if (selected![0] !== undefined) {
        this.tr?.nodes([selected![0]]);
        this.tr?.nodes()[0].draggable(true);
        this.fillColor = this.tr?.nodes()[0].getAttr('fill');
        this.strokeColor = this.tr?.nodes()[0].getAttr('stroke');
        this.strokeWidth = this.tr?.nodes()[0].getAttr('strokeWidth');
        this.dataService.setFillColor(this.fillColor!);
        this.dataService.setStrokeColor(this.strokeColor!);
        this.dataService.setsetstrokeWidth(this.strokeWidth!);
        this.layer.batchDraw();
      }
      this.selection = false;
    } else if (this.copying) {
      var pos = this.stage?.getPointerPosition();
      let tmp = this.copyShape;
      tmp.setAttrs({ x: pos!.x, y: pos!.y });
      this.layer.add(tmp);
      this.tr?.nodes([tmp]);
      this.layer.batchDraw();
      this.copying = false;
      var pack: string;
      var un_data: any;
      un_data = {
        "ShapeData": tmp.toJSON()
      };
      pack = Object.keys(un_data).map(function (key) { return [key, un_data[key]].map(encodeURIComponent).join("="); }).join("&");

      console.log(un_data);
      let xhr = new XMLHttpRequest();
      xhr.open("POST", this.API_url + 'update' + '?' + pack, false);
      xhr.send();
      this.sendCoordinate = false;
    }

    if (this.tr?.nodes()[0] !== undefined)
      this.tr?.nodes()[0].off('scaleXChange scaleYChange xChange yChange');

    this.shapeDimension = false;
    this.shapeCreation = false;
    this.brush = false;
  }


  @HostListener('click') onMouseClick(){
    if (this.selection) {
      let shapes = this.stage?.find('.shape');
      let box = this.selectionRectangle!.getClientRect();
      let selected = shapes?.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      );

      if (selected![0] !== undefined){
        this.tr?.nodes([selected![0]]);
        this.tr?.nodes()[0].draggable(true);
        this.fillColor = this.tr?.nodes()[0].getAttr('fill');
        this.strokeColor = this.tr?.nodes()[0].getAttr('stroke');
        this.strokeWidth = this.tr?.nodes()[0].getAttr('strokeWidth');
        this.dataService.setFillColor(this.fillColor!);
        this.dataService.setStrokeColor(this.strokeColor!);
        this.dataService.setsetstrokeWidth(this.strokeWidth!);
        this.layer.batchDraw();
      }
      this.selection = false;
    } else if (this.copying){
      let pos = this.stage?.getPointerPosition();
        let tmp = this.copyShape;
        tmp.setAttrs({x: pos!.x, y: pos!.y});
        this.layer.add(tmp);
        this.tr?.nodes([tmp]);
        this.layer.batchDraw();
        this.copying = false;
    }
  }
}