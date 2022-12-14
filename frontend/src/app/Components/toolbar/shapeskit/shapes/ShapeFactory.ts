import { Ishape } from "./Ishape";
import { Shape } from "./Shape";
import { Circle } from "./Circle";
import { Ellipse } from "./Ellipse";
import { Rectangle } from "./Rectangle";
import {Square} from "./Square";
import {Triangle} from "./Triangle";
import { Diamond } from "./Diamond";
import { Pentagon } from "./Pentagon";
import { Hexagon } from "./Hexagon";
import { Diamond_star } from "./Diamond_star";
import { Penta_star } from "./Penta_star";
import { Hexa_star } from "./Hexa_star";

export class ShapeFactory {

    constructor(){ }

    public getShape(shape:string) {
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
        else if (shape === "diamond")
            return new Diamond;
        else if (shape === "pentagon")
            return new Pentagon;
        else if (shape === "hexagon")
            return new Hexagon;
        else if (shape === "diamond_star")
            return new Diamond_star;
        else if (shape === "penta_star")
            return new Penta_star;
        else if (shape === "hexa_star")
          return new Hexa_star;
        return null;
    }
}
