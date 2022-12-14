package com.paint.backend.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
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
            System.out.println(y);
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
            System.out.println(result);
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
        ObjectMapper objectMapper = new XmlMapper();
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
        objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        return null;
    }
}
