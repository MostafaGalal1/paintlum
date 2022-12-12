package com.paint.backend.Shapes;


import org.json.JSONObject;

import java.util.Stack;

public abstract class Shape implements IShape {
    protected String id;
    protected boolean draggable,strokeScaleEnabled;
    protected float x, y, strokeWidth;
    protected String className, stroke, fill;
    protected Stack<JSONObject> UndoUpdate = new Stack<>();
    protected Stack<JSONObject> RedoUpdate = new Stack<>();


    public void setID(String ID) { this.id = ID; }

    public void setType(String type) { this.className = type; }

    public void clearRedo() {
        RedoUpdate.clear();
    }

    public boolean isUpdated(){
        return !UndoUpdate.isEmpty();
    }
    public abstract JSONObject draw();

    public abstract void update(JSONObject jsonUpdate, String state);

    public void delete(){
        UndoUpdate.push(new JSONObject().put("delete", true));
    }

    public String undoUpdate(){
        if(UndoUpdate.empty()){
            return "delete";
        }else if(UndoUpdate.peek().has("delete")){
            RedoUpdate.push(UndoUpdate.pop());
        }else{
            update(UndoUpdate.pop(),"old");
        }
        return id;
    }

    public String redoUpdate(){
        System.out.println(RedoUpdate.toString());
        if(RedoUpdate.empty()){
            return "create";
        }else if(RedoUpdate.peek().has("delete")){
            UndoUpdate.push(RedoUpdate.pop());
            return "delete";
        }else{
            update(RedoUpdate.pop(),"new");
        }
        return id;
    }

}
