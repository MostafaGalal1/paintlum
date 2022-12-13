package com.paint.backend.Service;

import com.google.gson.Gson;
import com.paint.backend.Shapes.IShape;

import org.json.JSONObject;

import java.util.*;



public final class Database {

    private int MaxID = 0;
    private Stack<String> UndoStack = new Stack<>();
    private Stack<String> RedoStack = new Stack<>();
    private Map<String, IShape> Shapes = new HashMap<>();
    private static Database instance;
    private Database(){}

    public static Database getInstance() {
        if (instance == null) {
            instance = new Database();
        }
        return instance;
    }

    public String add(IShape shape) {
        String ID = Integer.toString(MaxID++);
        shape.setID(ID);
        UndoStack.push(ID);
        Shapes.put(ID, shape);
        clearRedo();

        System.out.println(shape.draw().toString());
        return ID;
    }

    private void clearRedo(){
        while(!RedoStack.isEmpty()) {
            String ID = RedoStack.pop();
            if(Shapes.containsKey(ID)&&!Shapes.get(ID).isUpdated()){
                Shapes.remove(ID);
            }
        }
        for (Map.Entry<String,IShape> shape : Shapes.entrySet()) {
            shape.getValue().clearRedo();
        }
    }

    public IShape getShape(String ID){
        return Shapes.get(ID);
    }

    public void update(String ID,JSONObject update){
        UndoStack.push(ID);
        Shapes.get(ID).update(update,"new");
        System.out.println(Shapes.get(ID).draw().toString());
        clearRedo();
    }

    public void delete(String ID){
        UndoStack.push(ID);
        Shapes.get(ID).delete();
        clearRedo();
    }

    public String undo(){
        if(UndoStack.isEmpty()){return "empty";}
        String ID = UndoStack.peek();
        RedoStack.push(UndoStack.pop());

        String state = Shapes.get(ID).undoUpdate();
        if(Objects.equals(state, "delete")){
            return new JSONObject().put("delete",ID).toString();
        }
        System.out.println(Shapes.get(ID).draw().toString());


        return new JSONObject().put(state,Shapes.get(ID).draw()).toString();
    }

    public String redo(){
        if(RedoStack.isEmpty()){ return "empty";}
        String ID = RedoStack.peek();
        UndoStack.push(RedoStack.pop());

        String state = Shapes.get(ID).redoUpdate();
        if(Objects.equals(state, "delete")){
            return  new JSONObject().put("delete",ID).toString();
        }
        System.out.println(Shapes.get(ID).draw().toString());

        return new JSONObject().put(state,Shapes.get(ID).draw()).toString();
    }

    public JSONObject getData(){
        ArrayList<String> shapes = new ArrayList<>();
        for (Map.Entry<String,IShape> shape : Shapes.entrySet()) {
            shapes.add(new Gson().toJson(shape.getValue()));
        }
        return new JSONObject().put("MaxID",MaxID)
                .put("UndoStack",new Gson().toJson(UndoStack)).put("RedoStack",new Gson().toJson(RedoStack)).put("shapes",shapes);
    }
    public void setData(JSONObject data){
        Gson gson = new Gson();
        MaxID = data.getInt("MaxID");
        UndoStack = gson.fromJson(data.get("UndoStack").toString(),Stack.class);
        RedoStack = gson.fromJson(data.get("RedoStack").toString(),Stack.class);
        /*
        for(int shapeID=0 ;shapeID<gson.fromJson(data.get("shapes").toString(),ArrayList.class).size();shapeID++){
                Shapes.put(shapeID,)
        }*/
        System.out.println(gson.toJson(UndoStack));
        System.out.println(gson.toJson(RedoStack));
        System.out.println("asdadasdasdsad");
    }

    public void clear() {
        MaxID = 0;
        UndoStack.clear();
        RedoStack.clear();
        Shapes.clear();
    }
}
