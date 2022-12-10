package com.paint.backend.Shapes;

import org.json.JSONObject;

public interface IShape {
     void setID(int ID);

     void setType(String Type);

     void update(JSONObject jsonUpdate, String state);

     String draw();

     boolean isUpdated();
     void clearRedo();

     void delete();

     String undoUpdate();

     String redoUpdate();

}
