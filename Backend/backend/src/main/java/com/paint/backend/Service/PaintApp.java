package com.paint.backend.Service;

import com.google.gson.Gson;
import com.paint.backend.Shapes.Circle;
import com.paint.backend.Shapes.IShape;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;

@Service
public class PaintApp {

    private final Database database;
    private final FileManager fileManager;

    public PaintApp() throws IOException {
        database=Database.getInstance();
        fileManager = FileManager.getInstance();
    }

    public String create(String ShapeData){
        JSONObject jsonShape = new JSONObject(ShapeData);
        IShape shape = ShapesFactory.create(jsonShape);
        shape.setType((String) jsonShape.get("className"));
        return database.add(shape);
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
        JSONObject update = dataCompare(database.getShape(ID).draw(),jsonUpdatedShape);
        database.update(ID,update);
        database.getData();
    }

    public void delete(String ID){
        database.delete(ID);
    }

    public String undo(){
        return database.undo();
    }

    public String redo(){
        return database.redo();
    }

    public void restart(){
        database.clear();
    }

    public File save(String fileType){
        if (fileType.equalsIgnoreCase("json")) {
           return fileManager.saveJson();
        }else if (fileType.equalsIgnoreCase("xml")){
           return fileManager.saveXml();
        }
        return null;
    }

}
