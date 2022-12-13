package com.paint.backend.Shapes;

import org.json.JSONObject;

import java.util.Objects;


public class Circle extends Shape {
    private float radius;

    public Circle() {}

    @Override
    public JSONObject draw() {
        JSONObject attrs = new JSONObject().put("id",id).put("x",x).put("y",y).put("stroke",stroke).put("draggable",draggable)
                .put("strokeScaleEnabled",strokeScaleEnabled).put("strokeWidth",strokeWidth).put("fill",fill).put("radius",radius)
                .put("scaleX", scaleX ).put("scaleY",scaleY);
        return new JSONObject().put("className",className).put("attrs",attrs);
    }
}
