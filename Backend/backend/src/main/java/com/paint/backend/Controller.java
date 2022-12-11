package com.paint.backend;


import com.paint.backend.Service.Database;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/paint")
public class Controller {

    private final Database database;

    public Controller(Database database) { this.database = database; }

    @GetMapping("/create")
    @ResponseBody
    public int createShape(@RequestParam String ShapeData){
        return database.add(ShapeData);
    }

    @PostMapping("/update")
    @ResponseBody
    public void update(@RequestBody String updatedShape){
        database.update(updatedShape);
    }

    @PostMapping("/delete/{ID}")
    public void delete(@PathVariable("ID") int ID){
        database.delete(ID);
    }

    @GetMapping("/undo")
    public String undo(){
        return database.undo();
    }

    @GetMapping("/redo")
    public String redo(){
        return database.redo();
    }

}
