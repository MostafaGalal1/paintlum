package com.paint.backend.Service;

import com.google.gson.Gson;
import com.paint.backend.Shapes.IShape;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class Database {

    private int MaxID = 0;
    private Stack<String> UndoStack = new Stack<>();
    private Stack<String> RedoStack = new Stack<>();
    private Map<String, IShape> Shapes = new HashMap<>();

    public String add(String ShapeData) {
        String ID = Integer.toString(MaxID++);
        JSONObject jsonShape = new JSONObject(ShapeData);
        IShape shape = ShapesFactory.create(jsonShape);
        shape.setType((String) jsonShape.get("className"));
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
        for (Map.Entry<String,IShape> shape_it : Shapes.entrySet()) {
            shape_it.getValue().clearRedo();
        }
    }

    private JSONObject dataCompare(JSONObject oldShape,JSONObject updatedShape){
        JSONObject update = new JSONObject().put("attrs","");
        for (Iterator<String> it = ((JSONObject)oldShape.get("attrs")).keys(); it.hasNext();) {
            String key =it.next();
            Object old= ((JSONObject)oldShape.get("attrs")).get(key);
            Object updated = ((JSONObject)updatedShape.get("attrs")).get(key);

            if(key.equals("x")||key.equals("y")||key.equals("strokeWidth")
                    ||key.equals("radius")||key.equals("radiusX")||key.equals("radiusY")||key.equals("width")||key.equals("height")){
                updated =  new Gson().fromJson(updated.toString(),float.class);
            }else if(key.equals("points")){ updated =new Gson().fromJson(updated.toString(),float[].class);}

            if(!old.equals(updated)){
                if(key.equals("x")){
                    key = "move";
                    old = new JSONObject().put("x",old).put("y",((JSONObject)oldShape.get("attrs")).get("y"));
                    updated = new JSONObject().put("x",updated).put("y",((JSONObject)updatedShape.get("attrs")).get("y"));
                }else if (key.equals("y")){
                    key = "move";
                    old = new JSONObject().put("y",old).put("y",((JSONObject)oldShape.get("attrs")).get("x"));
                    updated = new JSONObject().put("y",updated).put("x",((JSONObject)updatedShape.get("attrs")).get("x"));
                }
                return update.put("attrs",key).put("old",old).put("new",updated);
            }
        }
        return update;
    }

    public void update(String updatedShape){
        JSONObject jsonUpdatedShape = new JSONObject(updatedShape);
        String ID = ((JSONObject)jsonUpdatedShape.get("attrs")).getString("id");
        UndoStack.push(ID);

        JSONObject update = dataCompare(Shapes.get(ID).draw(),jsonUpdatedShape);
        Shapes.get(ID).update(update,"new");
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

        String state = Shapes.get(ID).redoUpdate();
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

    public void save(){

    }

    public void load(){

    }

    public void restart() {
        MaxID = 0;
        UndoStack.clear();
        RedoStack.clear();
        Shapes.clear();
    }
}
