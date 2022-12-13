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
       // System.out.println( ((JSONObject)jsonShape.get("attrs")).get("scaleX").toString());
        return database.add(shape);
    }

    private JSONObject dataCompare(String updateKey,JSONObject oldShape,JSONObject updatedShape){
        JSONObject update = new JSONObject().put("key",updateKey);
        JSONObject old = new JSONObject();
        JSONObject updated = new JSONObject();
        switch (updateKey){
         case "scale"->{
             old = old.put("x",((JSONObject)oldShape.get("attrs")).get("x")).put("y",((JSONObject)oldShape.get("attrs")).get("y"))
                     .put("scaleX",((JSONObject)oldShape.get("attrs")).get("scaleX")).put("scaleY",((JSONObject)oldShape.get("attrs")).get("scaleY"));
             updated = updated.put("x",((JSONObject)updatedShape.get("attrs")).get("x")).put("y",((JSONObject)updatedShape.get("attrs")).get("y"))
                     .put("scaleX",((JSONObject)updatedShape.get("attrs")).get("scaleX")).put("scaleY",((JSONObject)updatedShape.get("attrs")).get("scaleY"));
         }
         case  "move"->{
             old = old.put("x",((JSONObject)oldShape.get("attrs")).get("x")).put("y",((JSONObject)oldShape.get("attrs")).get("y"));
             updated = update.put("x",((JSONObject)updatedShape.get("attrs")).get("x")).put("y",((JSONObject)updatedShape.get("attrs")).get("y"));
         }
         case  "style"->{
             old = old.put("fill",((JSONObject)oldShape.get("attrs")).get("fill")).put("stroke",((JSONObject)oldShape.get("attrs")).get("stroke"))
                     .put("strokeWidth",((JSONObject)oldShape.get("attrs")).get("strokeWidth"));
             updated = update.put("fill",((JSONObject)updatedShape.get("attrs")).get("fill")).put("stroke",((JSONObject)updatedShape.get("attrs")).get("stroke"))
                     .put("strokeWidth",((JSONObject)updatedShape.get("attrs")).get("strokeWidth"));
         }
        }
        return update.put("old",old).put("new",updated);
    }

    public void update(String updateData){
        JSONObject jsonUpdateData = new JSONObject(updateData);
        String updateKey = jsonUpdateData.getString("key");
        JSONObject jsonUpdatedShape = jsonUpdateData.getJSONObject("updatedShape");
        String ID = ((JSONObject)jsonUpdatedShape.get("attrs")).getString("id");
        JSONObject update = dataCompare(updateKey,database.getShape(ID).draw(),jsonUpdatedShape);
        database.update(ID,update);
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
            System.out.println(fileManager.saveXml());
           return fileManager.saveXml();
        }
        return null;
    }
    public void load(JSONObject data){
        database.setData(data);
    }

}
