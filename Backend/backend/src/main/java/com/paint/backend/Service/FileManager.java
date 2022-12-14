package com.paint.backend.Service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.json.JSONObject;
import org.json.XML;

import java.beans.XMLDecoder;
import java.beans.XMLEncoder;
import java.io.*;
import java.util.ArrayList;

public final class FileManager {

    private final Database database;
    private static FileManager instance;

    private FileManager() { database=Database.getInstance(); }

    public static FileManager getInstance() {
        if (instance == null) {
            instance = new FileManager();
        }
        return instance;
    }

    public File saveJson(){
        File file = new File("temp.json");
        try {
            FileWriter fileWriter =new FileWriter(file);
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            gson.toJson(database.getData(),fileWriter);
            fileWriter.flush();
            fileWriter.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return file;
    }

    public JSONObject loadJson(File file){
        try {
            Gson json = new Gson();
            FileReader f = new FileReader(String.valueOf(file.toPath()));
            JSONObject y = json.fromJson(f, JSONObject.class);
            f.close();
            return y;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public JSONObject loadXml(File file) throws IOException {
        try {
            FileInputStream f2 = new FileInputStream(file.toPath().toString());
            XMLDecoder mydecoder = new XMLDecoder(f2);
            String result = (String) mydecoder.readObject();
            mydecoder.close();
            f2.close();
            return XML.toJSONObject(result);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public File saveXml(){
        File file = new File("temp.xml");
        try {
            FileOutputStream fileStream = new FileOutputStream(file);
            XMLEncoder encoder = new XMLEncoder(fileStream);
            encoder.writeObject(XML.toString(database.getData(),"data"));
            encoder.close();
            fileStream.flush();
            fileStream.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return file;
    }



}
