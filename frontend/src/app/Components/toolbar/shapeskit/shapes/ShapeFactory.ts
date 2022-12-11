import { Ishape } from "./Ishape";
import { Shape } from "./Shape";
import { Circle } from "./Circle";
import { Ellipse } from "./Ellipse";
import { Rectangle } from "./Rectangle";
import {Square} from "./Square";
import {Triangle} from "./Triangle";
import { Pentagon } from "./Pentagon";
import { Hexagon } from "./Hexagon";

export class ShapeFactory {

    constructor(){ }

    public getShape(shape:string):Shape {
        if (shape === "circle")
            return new Circle;
        else if (shape === "ellipse")
            return new Ellipse;
        else if (shape === "square")
            return new Square();
        else if (shape === "rectangle")
            return new Rectangle;
        else if (shape === "rounded_rectangle")
            return new Ellipse;
        else if (shape === "triangle")
          return new Triangle;
        else if (shape === "pentagon")
            return new Pentagon;
        else if (shape === "hexagon")
          return new Hexagon;
        return new Ellipse;
    }
}
