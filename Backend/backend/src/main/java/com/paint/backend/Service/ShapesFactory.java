package com.paint.backend.Service;

import com.paint.backend.Shapes.*;
import com.paint.backend.Shapes.IShape;
import org.json.JSONObject;
import com.google.gson.Gson;

public class ShapesFactory{

    public static IShape create(JSONObject jsonShape) {
        IShape shape = null;
        Gson gson = new Gson();
        if ((jsonShape.getString("className")).equalsIgnoreCase("circle")) {
            shape = gson.fromJson(jsonShape.get("attrs").toString(), Circle.class);
        } else if ((jsonShape.getString("className")).equalsIgnoreCase("regularpolygon")) {
            shape = gson.fromJson(jsonShape.get("attrs").toString(), Polygon.class);
        } else if ((jsonShape.getString("className")).equalsIgnoreCase("rect")) {
            shape = gson.fromJson(jsonShape.get("attrs").toString(), Rectangle.class);
        } else if ((jsonShape.getString("className")).equalsIgnoreCase("ellipse")) {
            shape = gson.fromJson(jsonShape.get("attrs").toString(), Ellipse.class);
        } else if ((jsonShape.getString("className")).equalsIgnoreCase("line")) {
            shape = gson.fromJson(jsonShape.get("attrs").toString(), LineSegment.class);
        }else if ((jsonShape.getString("className")).equalsIgnoreCase("Star")){
            shape = gson.fromJson(jsonShape.get("attrs").toString(), Star.class);
        }
        return shape;
    }


}
