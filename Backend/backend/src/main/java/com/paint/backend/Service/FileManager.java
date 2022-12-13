package com.paint.backend.Service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.beans.XMLEncoder;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;

public final class FileManager {

    private final Database database;
    private static FileManager instance;

    private FileManager() throws IOException { database=Database.getInstance(); }
    
    public static FileManager getInstance() throws IOException {
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

    public File saveXml(){
        File file = new File("temp.xml");
        try {
            FileOutputStream fileStream = new FileOutputStream(file);
            XMLEncoder encoder = new XMLEncoder(fileStream);
            encoder.writeObject(database.getData());
            encoder.close();
            fileStream.flush();
            fileStream.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return file;
    }



}
