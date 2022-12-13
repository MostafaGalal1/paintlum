package com.paint.backend.Shapes;

import org.json.JSONObject;

import java.util.Objects;

public class Rectangle extends Shape {
    private float width, height;

    public Rectangle() {}

    @Override
    public JSONObject draw() {
        JSONObject attrs = new JSONObject().put("id",id).put("x",x).put("y",y).put("stroke",stroke).put("draggable",draggable)
                .put("strokeScaleEnabled",strokeScaleEnabled).put("strokeWidth",strokeWidth).put("fill",fill)
                .put("width",width).put("height",height);
        return new JSONObject().put("className",className).put("attrs",attrs);
    }
}
