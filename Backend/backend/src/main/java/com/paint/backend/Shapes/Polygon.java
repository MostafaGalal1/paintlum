package com.paint.backend.Shapes;

import org.json.JSONObject;

import java.util.Objects;

public class Polygon extends Shape {
    private int sides;
    private float  radius;

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
            case "scale"-> {
                this.scaleX = (((JSONObject)(jsonUpdate.get(state))).getFloat("scaleX"));
                this.scaleY = (((JSONObject)(jsonUpdate.get(state))).getFloat("scaleY"));
            }
            case "radius" -> this.radius = jsonUpdate.getFloat(state);
            case "strokeWidth" -> this.strokeWidth = jsonUpdate.getFloat(state);
            case "stroke"-> this.stroke = jsonUpdate.getString(state);
            case "fill"-> this.fill = jsonUpdate.getString(state);
            case "sides"-> this.sides = jsonUpdate.getInt(state);
        }
    }

    @Override
    public JSONObject draw() {
        JSONObject attrs = new JSONObject().put("id",id).put("x",x).put("y",y).put("stroke",stroke).put("draggable",draggable)
                .put("strokeScaleEnabled",strokeScaleEnabled).put("strokeWidth",strokeWidth).put("fill",fill)
                .put("radius",radius).put("sides",sides);
        return new JSONObject().put("className",className).put("attrs",attrs);
    }
}
