package com.paint.backend.Shapes;

import com.google.gson.Gson;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.Objects;


public class LineSegment extends Shape{

    private float[] points;

    public LineSegment() {}

    @Override
    public JSONObject draw() {
        JSONObject attrs = new JSONObject().put("id",id).put("x",x).put("y",y).put("stroke",stroke).put("draggable",draggable)
                .put("strokeScaleEnabled",strokeScaleEnabled).put("strokeWidth",strokeWidth).put("fill",fill).put("points",points);
        return new JSONObject().put("className",className).put("attrs",attrs);
    }
}
