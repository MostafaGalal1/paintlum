package com.paint.backend.Shapes;

import org.json.JSONObject;


public class Star extends Shape{
    private float innerRadius;
    private float outerRadius;
    private int numPoints = 5;

    @Override
    public JSONObject draw() {
        JSONObject attrs = new JSONObject().put("id",id).put("x",x).put("y",y).put("stroke",stroke).put("draggable",draggable)
                .put("strokeScaleEnabled",strokeScaleEnabled).put("strokeWidth",strokeWidth).put("fill",fill).put("innerRadius",innerRadius)
                .put("outerRadius",outerRadius).put("numPoints",numPoints).put("scaleX", scaleX ).put("scaleY",scaleY);
        return new JSONObject().put("className",className).put("attrs",attrs);
    }
}
