import Konva from "konva";
import { Shape } from "./Shape";

export class Ellipse extends Shape {
    private _radiusX?: number;
    private _radiusY?: number;

    constructor(x?:number, y?:number, radiusX?:number, radiusY?:number, fill?: string, stroke?: string, strokeWidth?: number, draggable?: boolean, scaleX?: number, scaleY?: number){
        super(x, y, fill, stroke, strokeWidth, draggable, scaleX, scaleY);
        this._radiusX = radiusX;
        this._radiusY = radiusY;
    }

    public get radius(): number | undefined {
        return this._radiusX;
    }
    public set radius(value: number | undefined) {
        this._radiusX = value;
    }

    public get radiusY(): number | undefined {
        return this._radiusY;
    }
    public set radiusY(value: number | undefined) {
        this._radiusY = value;
    }

    override getKonva() {
        return new Konva.Ellipse({
            name: 'shape',
            x: this._x,
            y: this._y,
            radiusX: this._radiusX!,
            radiusY: this._radiusY!,
            fill: this._fill,
            stroke: this._stroke,
            strokeWidth: this._strokeWidth,
            draggable: this._draggable,
            scaleX: this._scaleX,
            scaleY: this._scaleY,
            strokeScaleEnabled: false,
        });
    }
}