package com.paint.backend;

import com.fasterxml.jackson.databind.util.JSONPObject;
import com.google.gson.Gson;
import com.paint.backend.Service.Database;
import com.paint.backend.Shapes.Circle;
import com.paint.backend.Shapes.Shape;
import org.apache.tomcat.util.json.JSONParser;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;
import java.util.Scanner;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/paint")
public class Controller {

    private final Database database;

    public Controller(Database database) { this.database = database; }

    @GetMapping("/create")
    @ResponseBody
    public String createShape(@RequestParam String ShapeData){
        return database.add(ShapeData);
    }

    @PostMapping("/update")
    @ResponseBody
    public void update(@RequestParam String updatedShape){
        database.update(updatedShape);
    }

    @PostMapping("/delete/{ID}")
    public void delete(@PathVariable("ID") String ID){
        database.delete(ID);
    }

    @RequestMapping(value = "/file", method = RequestMethod.POST)
    public String load(@RequestPart(name = "file") MultipartFile multipartFile, @RequestPart(name = "ext") String ext) {
        InputStream initialStream;
        File targetFile;
        try {
            initialStream = multipartFile.getInputStream();
            byte[] buffer = new byte[initialStream.available()];
            if(initialStream.read(buffer) == -1) throw new RuntimeException("Empty File");
            targetFile = new File("targetFile.tmp");
            if (!targetFile.createNewFile()) throw new RuntimeException("Target File Cannot Be Created");
            OutputStream outStream = new FileOutputStream(targetFile);
            outStream.write(buffer);
            outStream.close();
            Scanner myReader = new Scanner(targetFile);
            StringBuilder sb = new StringBuilder();
            while (myReader.hasNextLine()) {
                String data = myReader.nextLine();
                sb.append(data);
            }
            myReader.close();
            if(!targetFile.delete()) System.out.println("Could not delete file");
            return database.load(sb);
        } catch (IOException e1) {
            e1.printStackTrace();
        }
        return null;
    }

    @GetMapping("/undo")
    public String undo(){
        return database.undo();
    }

    @GetMapping("/redo")
    public String redo(){
        return database.redo();
    }

    @PostMapping("/restart")
    public void restart(){
        database.restart();
    }
}
