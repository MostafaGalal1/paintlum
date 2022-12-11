package com.paint.backend.Shapes;

import org.json.JSONObject;

import java.util.Objects;


public class Ellipse extends Shape {
    private float radiusX, radiusY;

    public Ellipse() {}

    @Override
    public void update(JSONObject jsonUpdate, String state){
        if(Objects.equals(state, "new")){ UndoUpdate.push(jsonUpdate); }
        else{ RedoUpdate.push(jsonUpdate); }

        switch(jsonUpdate.getString("attrs")){
            case "move"-> {
                this.x = (((JSONObject)(jsonUpdate.get(state))).getFloat("x"));
                this.y = (((JSONObject)(jsonUpdate.get(state))).getFloat("y"));
            }
            case "radiusX" -> this.radiusX = jsonUpdate.getFloat(state);
            case "radiusY" -> this.radiusY = jsonUpdate.getFloat(state);
            case "strokeWidth" -> this.strokeWidth = jsonUpdate.getFloat(state);
            case "stroke"-> this.stroke = jsonUpdate.getString(state);
            case "fill"-> this.fill = jsonUpdate.getString(state);
        }
    }

    @Override
    public JSONObject draw() {
        JSONObject attrs = new JSONObject().put("id",id).put("x",x).put("y",y).put("stroke",stroke).put("draggable",draggable)
                .put("strokeScaleEnabled",strokeScaleEnabled).put("strokeWidth",strokeWidth)
                .put("fill",fill).put("radiusX",radiusX).put("radiusY",radiusY);
        return new JSONObject().put("className",className).put("attrs",attrs);
    }
}
