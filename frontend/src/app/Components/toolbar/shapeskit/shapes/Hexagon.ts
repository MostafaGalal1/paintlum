import Konva from "konva";
import { Shape } from "./Shape";

export class Hexagon extends Shape {
    private _radius?: number;

    constructor(x?:number, y?:number, radius?:number, fill?: string, stroke?: string, strokeWidth?: number, draggable?: boolean){
        super(x, y, fill, stroke, strokeWidth, draggable);
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
            sides: 6,
            radius: this._radius!,
            fill: this._fill,
            stroke: this._stroke,
            strokeWidth: this._strokeWidth,
            draggable: this._draggable,
            strokeScaleEnabled: false,
        });
    }
}