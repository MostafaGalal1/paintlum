package com.paint.backend.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.json.JSONObject;
import org.xml.sax.SAXException;

import javax.swing.text.Document;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;


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
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = (Document) db.parse(file);
            System.out.println(doc.toString());
            return null;
        } catch (ParserConfigurationException e) {
            throw new RuntimeException(e);
        } catch (SAXException e) {
            throw new RuntimeException(e);
        }
    }

    public File saveXml(){
        File file = new File("temp.xml");
        ObjectMapper objectMapper = new XmlMapper();
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
        objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        return file;
    }



}
