import Konva from "konva";
import { Shape } from "./Shape";

export class Rectangle extends Shape {
    private _width?: number;
    private _height?: number | undefined;

    constructor(x?:number, y?:number, width?:number, height?:number, fill?: string, stroke?: string, strokeWidth?: number, draggable?: boolean){
        super(x, y, fill, stroke, strokeWidth, draggable);
        this._width = width;
        this._height = height;
    }

    public get width(): number | undefined{
        return this._width;
    }
    public set width(value: number | undefined) {
        this._width = value;
    }
    public get height(): number | undefined {
        return this._height;
    }
    public set height(value: number | undefined) {
        this._height = value;
    }

    override getKonva() {
        return new Konva.Rect({
            x: this._x,
            y: this._y,
            width: this._width,
            height: this._height,
            fill: this._fill,
            stroke: this._stroke,
            strokeWidth: this._strokeWidth,
            draggable: this._draggable,
        });
    }
}
