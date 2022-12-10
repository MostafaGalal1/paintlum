package com.paint.backend.Shapes;

import org.json.JSONObject;

import java.util.Objects;

public class Polygon extends Shape {
    private int sides;
    private float x, y, radius, strokeWidth, alpha, rotateAngle;
    private String stroke, fill;

    public Polygon() {}

    @Override
    public void update(JSONObject jsonUpdate, String state){
        if(Objects.equals(state, "new")){ UndoUpdate.push(jsonUpdate); }
        else{ RedoUpdate.push(jsonUpdate); }

        switch(jsonUpdate.getString("attrs")){
            case "move"-> {
                this.x = (((JSONObject)(jsonUpdate.get(state))).getFloat("x"));
                this.y = (((JSONObject)(jsonUpdate.get(state))).getFloat("y"));
            }
            case "radius" -> this.radius = jsonUpdate.getFloat(state);
            case "strokeWidth" -> this.strokeWidth = jsonUpdate.getFloat(state);
            case "alpha" -> this.alpha = jsonUpdate.getFloat(state);
            case "rotateAngle" -> this.rotateAngle = jsonUpdate.getFloat(state);
            case "stroke"-> this.stroke = jsonUpdate.getString(state);
            case "fill"-> this.fill = jsonUpdate.getString(state);
            case "Type"-> this.Type = jsonUpdate.getString(state);
            case "sides"-> this.sides = jsonUpdate.getInt(state);
        }
    }

    @Override
    public String draw() {
        return "Polygon {" + "\n" +
                "\tx = " + x + ",\n" +
                "\ty = " + y + ",\n" +
                "\tID = " + ID + ",\n" +
                "\tstrokeWidth = " + strokeWidth + ",\n" +
                "\talpha = " + alpha + ",\n" +
                "\trotateAngle = " + rotateAngle + ",\n" +
                "\tstroke = '" + stroke + '\'' + ",\n" +
                "\tfill = '" + fill + '\'' + ",\n" +
                "\tType = '" + Type + '\'' + ",\n" +
                "\tradius = " + radius + ",\n" +
                "\tsides = " + sides + "\n" +
                '}';
    }
}
