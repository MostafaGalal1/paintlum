package com.paint.backend.Shapes;

import org.json.JSONObject;
import java.util.Objects;
import java.util.Stack;

public abstract class Shape implements IShape {
    protected String id;
    protected boolean draggable,strokeScaleEnabled;
    protected float x, y, strokeWidth , scaleX = 1, scaleY = 1;
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

    public void delete(){
        UndoUpdate.push(new JSONObject().put("delete", true));
    }

    public String undoUpdate(){
        if(UndoUpdate.empty()){
            RedoUpdate.push(new JSONObject().put("create",true));
            return "delete";
        }else if(UndoUpdate.peek().has("delete")){
            RedoUpdate.push(UndoUpdate.pop());
            return "create";
        }else{
            update(UndoUpdate.pop(),"old");
        }
        return "update";
    }

    public String redoUpdate(){
        if(RedoUpdate.peek().has("create")){
            RedoUpdate.pop();
            return "create";
        }else if(RedoUpdate.peek().has("delete")){
            UndoUpdate.push(RedoUpdate.pop());
            return "delete";
        }else{
            update(RedoUpdate.pop(),"new");
        }
        return "update";
    }

    public void update(JSONObject jsonUpdate, String state){
        if(Objects.equals(state, "new")){ UndoUpdate.push(jsonUpdate); }
        else{ RedoUpdate.push(jsonUpdate); }

        System.out.println(jsonUpdate);
        switch(jsonUpdate.getString("key")){
            case "move"-> {
                this.x = (((JSONObject)(jsonUpdate.get(state))).getFloat("x"));
                this.y = (((JSONObject)(jsonUpdate.get(state))).getFloat("y"));
            }
            case "scale"-> {
                this.x = (((JSONObject)(jsonUpdate.get(state))).getFloat("x"));
                this.y = (((JSONObject)(jsonUpdate.get(state))).getFloat("y"));
                this.scaleX = (((JSONObject)(jsonUpdate.get(state))).getFloat("scaleX"));
                this.scaleY = (((JSONObject)(jsonUpdate.get(state))).getFloat("scaleY"));
            }
            case "style"->{
                this.strokeWidth = (((JSONObject)(jsonUpdate.get(state))).getFloat("strokeWidth"));
                this.stroke = (((JSONObject)(jsonUpdate.get(state))).getString("stroke"));
                this.fill = (((JSONObject)(jsonUpdate.get(state))).getString("fill"));
            }
        }
    }
}
