package com.paint.backend;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.paint.backend.Service.PaintApp;
import com.paint.backend.Shapes.IShape;
import org.json.JSONObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.beans.XMLDecoder;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.Stack;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/paint")
public class Controller {

    private final PaintApp paint;

    public Controller(PaintApp paintApp) { this.paint = paintApp; }

    @GetMapping("/create")
    @ResponseBody
    public String createShape(@RequestParam String ShapeData){
        return paint.create(ShapeData);
    }

    @PostMapping("/update")
    @ResponseBody
    public void update(@RequestParam String updatedShape){
        paint.update(updatedShape);
    }

    @PostMapping("/delete/{ID}")
    public void delete(@PathVariable("ID") String ID){
        paint.delete(ID);
    }

    @RequestMapping(value = "/file", method = RequestMethod.POST)
    public String load(@RequestPart(name = "file") MultipartFile multipartFile, @RequestPart(name = "ext") String ext) throws IOException {
        try {
            Gson json = new Gson();
            FileReader f = new FileReader("C:\\Users\\pc\\OneDrive-AlexandriaUniversity\\Desktop\\drawing.JSON");
            JSONObject y = json.fromJson(f, JSONObject.class);
            f.close();
            paint.load(y);
            return null;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @GetMapping("/undo")
    public String undo(){
        return paint.undo();
    }

    @GetMapping("/redo")
    public String redo(){
        return paint.redo();
    }

    @PostMapping("/restart")
    public void restart(){
        paint.restart();
    }

    @GetMapping("/save")
    public ResponseEntity<byte[]> save(@RequestParam String fileType){
        File file = paint.save(fileType);

        byte[] arr;
        try {
            arr = Files.readAllBytes(Paths.get(String.valueOf(file.toPath())));
        } catch (IOException e) {
            throw new RuntimeException("File Error");
        }

        if (!file.delete()){
            System.out.println("Could not delete file");
        }

        return ResponseEntity.ok().contentLength(arr.length)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getName()).body(arr);
    }

}
