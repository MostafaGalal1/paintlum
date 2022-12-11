package com.paint.backend.Shapes;

import org.json.JSONObject;

public interface IShape {
     void setID(String ID);

     void setType(String Type);

     void update(JSONObject jsonUpdate, String state);

     JSONObject draw();

     boolean isUpdated();
     void clearRedo();

     void delete();

     String undoUpdate();

     String redoUpdate();

}
