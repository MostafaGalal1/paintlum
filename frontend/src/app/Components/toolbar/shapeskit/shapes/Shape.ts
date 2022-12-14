import Konva from "konva";
import { Ishape } from "./Ishape";

export abstract class Shape implements Ishape {
    protected _x?: number | undefined;
    protected _y?: number | undefined;
    protected _fill?: string | undefined;
    protected _stroke?: string | undefined;
    protected _strokeWidth?: number | undefined;
    protected _draggable?: boolean | undefined;
    protected _scaleX?: number | undefined;
    protected _scaleY?: number | undefined;

    constructor(x?:number, y?:number, fill?: string, stroke?: string, strokeWidth?: number, draggable?: boolean, scaleX?: number, scaleY?: number){
        this._x = x;
        this._y = y;
        this._fill = fill;
        this._stroke = stroke;
        this._strokeWidth = strokeWidth;
        this._draggable = draggable;
        this._scaleX = scaleX;
        this._scaleY = scaleY;
    }

    public get x(): number | undefined{
        return this._x;
    }
    public set x(value: number | undefined) {
        this._x = value;
    }
    public get y(): number | undefined{
        return this._y;
    }
    public set y(value: number | undefined) {
        this._y = value;
    }
    public get fill(): string | undefined{
        return this._fill;
    }
    public set fill(value: string | undefined) {
        this._fill = value;
    }
    public get stroke(): string | undefined {
        return this._stroke;
    }
    public set stroke(value: string | undefined) {
        this._stroke = value;
    }
    public get strokeWidth(): number | undefined {
        return this._strokeWidth;
    }
    public set strokeWidth(value: number | undefined) {
        this._strokeWidth = value;
    }
    public get draggable(): boolean | undefined {
        return this._draggable;
    }
    public set draggable(value: boolean | undefined) {
        this._draggable = value;
    }
    public get scaleX(): number | undefined {
        return this._scaleX;
    }
    public set scaleX(value: number | undefined) {
        this._scaleX = value;
    }
    public get scaleY(): number | undefined {
        return this._scaleY;
    }
    public set scaleY(value: number | undefined) {
        this._scaleY = value;
    }

    getKonva() {
        return new Konva.Shape({
            name: 'shape',
            x: this._x,
            y: this._y,
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