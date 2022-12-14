import Konva from "konva";
import { Shape } from "./Shape";

export class Pentagon extends Shape {
    private _radius?: number;

    constructor(x?:number, y?:number, radius?:number, fill?: string, stroke?: string, strokeWidth?: number, draggable?: boolean, scaleX?: number, scaleY?: number){
        super(x, y, fill, stroke, strokeWidth, draggable, scaleX, scaleY);
        this._radius = radius;
    }

    public get radius(): number | undefined {
        return this._radius;
    }
    public set radius(value: number | undefined) {
        this._radius = value;
    }

    override getKonva() {
        return new Konva.RegularPolygon({
            name: 'shape',
            x: this._x,
            y: this._y,
            sides: 5,
            radius: this._radius!,
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