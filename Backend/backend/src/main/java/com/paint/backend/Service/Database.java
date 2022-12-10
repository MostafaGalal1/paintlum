package com.paint.backend.Service;

import com.paint.backend.Shapes.IShape;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.*;

import static java.lang.Integer.MIN_VALUE;

@Service
public class Database {
    private Stack<Integer> UndoStack = new Stack<>();
    private int NextID = MIN_VALUE;
    private Stack<Integer> RedoStack = new Stack<>();

    private Map<Integer, IShape> Shapes = new HashMap<>();
    public int add(String ShapeData) {
        int ID = NextID++;
        JSONObject jsonShape = new JSONObject(ShapeData);
        IShape shape = ShapesFactory.create(jsonShape);
        shape.setType((String) jsonShape.get("className"));
        shape.setID(ID);

        UndoStack.push(ID);
        Shapes.put(ID, shape);
        clearRedo();
        return ID;
    }

    private void clearRedo(){
        while(!RedoStack.isEmpty()) {
            int ID = RedoStack.pop();
            if(Shapes.containsKey(ID)&&!Shapes.get(ID).isUpdated()){
                Shapes.remove(ID);
            }
        }
        for (Map.Entry<Integer,IShape> shape_it : Shapes.entrySet()) {
            shape_it.getValue().clearRedo();
        }
    }

    public void update(int ID,String ShapeUpdate){
        UndoStack.push(ID);
        JSONObject jsonUpdate = new JSONObject(ShapeUpdate);
        Shapes.get(ID).update(jsonUpdate,"new");
        clearRedo();
    }

    public void delete(int ID){
        UndoStack.push(ID);
        Shapes.get(ID).delete();
        clearRedo();
    }

    public String undo(){
        if(UndoStack.empty()){ return "empty";}
        int ID = UndoStack.peek();
        RedoStack.push(UndoStack.pop());
        if(Objects.equals(Shapes.get(ID).undoUpdate(), "delete")){
            return "{'delete':"+Integer.toString(ID)+"}";
        }
        return Shapes.get(ID).draw();
    }

    public String redo(){
        if(RedoStack.empty()){ return "empty";}
        int ID = RedoStack.peek();
        UndoStack.push(RedoStack.pop());

        if(Objects.equals(Shapes.get(ID).redoUpdate(), "delete")){
            return "{'delete':"+Integer.toString(ID)+"}";
        }
        return Shapes.get(ID).draw();
    }

    public void save(){

    }

    public void load(){

    }
}
