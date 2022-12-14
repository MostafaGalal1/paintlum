package com.paint.backend.Shapes;

import org.json.JSONObject;


public class LineSegment extends Shape{

    private float[] points;
    private String  lineCap;
    private String  lineJoin;

    public LineSegment() {}

    @Override
    public JSONObject draw() {
        JSONObject attrs = new JSONObject().put("id",id).put("x",x).put("y",y).put("stroke",stroke).put("draggable",draggable)
                .put("strokeScaleEnabled",strokeScaleEnabled).put("strokeWidth",strokeWidth).put("fill",fill).put("points",points)
                .put("scaleX", scaleX ).put("scaleY",scaleY).put("lineCap",lineCap).put("lineJoin",lineJoin);
        return new JSONObject().put("className",className).put("attrs",attrs);
    }
}
