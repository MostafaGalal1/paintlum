import Konva from "konva";
import { Shape } from "./Shape";

export class Square extends Shape {
    private _side?: number;

    constructor(x?:number, y?:number, side?:number, fill?: string, stroke?: string, strokeWidth?: number, draggable?: boolean){
        super(x, y, fill, stroke, strokeWidth, draggable);
        this._side = side;
    }

    public get radius(): number | undefined {
        return this._side;
    }
    public set radius(value: number | undefined) {
        this._side = value;
    }

    override getKonva() {
        return new Konva.Rect({
            name: 'shape',
            x: this._x,
            y: this._y,
            width: this._side,
            height: this._side,
            fill: this._fill,
            stroke: this._stroke,
            strokeWidth: this._strokeWidth,
            draggable: this._draggable,
            strokeScaleEnabled: false,
        });
    }
}