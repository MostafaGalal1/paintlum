package com.paint.backend.Shapes;

import org.json.JSONObject;


public class rect extends Shape {
    private float width, height;

    public rect() {}

    @Override
    public JSONObject draw() {
        JSONObject attrs = new JSONObject().put("id",id).put("x",x).put("y",y).put("stroke",stroke).put("draggable",draggable)
                .put("strokeScaleEnabled",strokeScaleEnabled).put("strokeWidth",strokeWidth).put("fill",fill)
                .put("width",width).put("height",height)
                .put("scaleX", scaleX ).put("scaleY",scaleY);
        return new JSONObject().put("className",className).put("attrs",attrs);
    }
}
