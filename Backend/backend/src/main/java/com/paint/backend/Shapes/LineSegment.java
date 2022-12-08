package com.paint.backend.Shapes;

import com.google.gson.Gson;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.Objects;


public class LineSegment extends Shape{
    private float x, y, strokeWidth, alpha, rotateAngle;
    private String stroke, fill;
    private float[] points;

    public LineSegment() {}

    @Override
    public void update(JSONObject jsonUpdate, String state){
        if(Objects.equals(state, "new")){ UndoUpdate.push(jsonUpdate); }
        else{ RedoUpdate.push(jsonUpdate); }

        switch(jsonUpdate.getString("attrs")){
            case "move"-> {
                this.x = (((JSONObject)(jsonUpdate.get(state))).getFloat("x"));
                this.y = (((JSONObject)(jsonUpdate.get(state))).getFloat("y"));
            }
            case "strokeWidth" -> this.strokeWidth =jsonUpdate.getFloat(state);
            case "alpha" -> this.alpha = jsonUpdate.getFloat(state);
            case "rotateAngle" -> this.rotateAngle = jsonUpdate.getFloat(state);
            case "stroke"-> this.stroke = jsonUpdate.getString(state);
            case "fill"-> this.fill = jsonUpdate.getString(state);
            case "Type"-> this.Type = jsonUpdate.getString(state);
            case "points"-> this.points= new Gson().fromJson(jsonUpdate.get(state).toString(),float[].class);
        }
    }

    @Override
    public String draw() {
        return "LineSegment {" + "\n" +
                "\tx = " + x + ",\n" +
                "\ty = " + y + ",\n" +
                "\tID = " + ID + ",\n" +
                "\tstrokeWidth = " + strokeWidth + ",\n" +
                "\talpha = " + alpha + ",\n" +
                "\trotateAngle = " + rotateAngle + ",\n" +
                "\tstroke = '" + stroke + '\'' + ",\n" +
                "\tfill = '" + fill + '\'' + ",\n" +
                "\tType = '" + Type + '\'' + ",\n" +
                "\tpoints = " + Arrays.toString(points) + "\n" +
                '}';
    }
}
