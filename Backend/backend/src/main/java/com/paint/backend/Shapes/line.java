package com.paint.backend.Shapes;

import org.json.JSONObject;

import java.util.Objects;


public class line extends Shape{

    private float[] points;
    private String  lineCap;
    private String  lineJoin;

    public line() {}

    @Override
    public JSONObject draw() {
        JSONObject attrs = new JSONObject().put("id",id).put("x",x).put("y",y).put("stroke",stroke).put("draggable",draggable)
                .put("strokeScaleEnabled",strokeScaleEnabled).put("strokeWidth",strokeWidth).put("fill",fill).put("points",points)
                .put("scaleX", scaleX ).put("scaleY",scaleY).put("lineCap",lineCap).put("lineJoin",lineJoin);
        return new JSONObject().put("className",className).put("attrs",attrs);
    }

    @Override
    public void update(JSONObject jsonUpdate, String state){
        if(Objects.equals(state, "new")){ UndoUpdate.push(jsonUpdate); }
        else{ RedoUpdate.push(jsonUpdate); }

        System.out.println(jsonUpdate);
        switch(jsonUpdate.getString("key")){
            case "move"-> {
                this.x = (((JSONObject)(jsonUpdate.get(state))).getFloat("x"));
                this.y = (((JSONObject)(jsonUpdate.get(state))).getFloat("y"));
            }
            case "scale"-> {
                this.x = (((JSONObject)(jsonUpdate.get(state))).getFloat("x"));
                this.y = (((JSONObject)(jsonUpdate.get(state))).getFloat("y"));
                this.scaleX = (((JSONObject)(jsonUpdate.get(state))).getFloat("scaleX"));
                this.scaleY = (((JSONObject)(jsonUpdate.get(state))).getFloat("scaleY"));
            }
            case "style"->{
                this.strokeWidth = (((JSONObject)(jsonUpdate.get(state))).getFloat("strokeWidth"));
                this.stroke = (((JSONObject)(jsonUpdate.get(state))).getString("stroke"));
            }
        }
    }
}
