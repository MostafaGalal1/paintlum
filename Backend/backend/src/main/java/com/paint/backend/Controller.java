package com.paint.backend;

import com.paint.backend.Service.PaintApp;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Scanner;

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
            return null;
        } catch (IOException e1) {
            e1.printStackTrace();
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
