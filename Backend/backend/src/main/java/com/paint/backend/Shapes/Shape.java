package com.paint.backend.Shapes;


import org.json.JSONObject;

import java.util.Stack;

public abstract class Shape implements IShape {
    protected  int ID;
    protected String Type;

    protected Stack<JSONObject> UndoUpdate = new Stack<>();
    protected Stack<JSONObject> RedoUpdate = new Stack<>();


    public void setID(int id) { this.ID = id; }

    public void setType(String type) { this.Type = type; }

    public void clearRedo() {
        RedoUpdate.clear();
    }

    public boolean isUpdated(){
        return !UndoUpdate.empty();
    }
    public abstract String draw();

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
        return Integer.toString(ID);
    }

    public String redoUpdate(){
        if(RedoUpdate.empty()){
            return "create";
        }else if(RedoUpdate.peek().has("delete")){
            UndoUpdate.push(RedoUpdate.pop());
            return "delete";
        }else{
            update(RedoUpdate.pop(),"new");
        }
        return Integer.toString(ID);
    }

}
