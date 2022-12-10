package com.paint.backend;


import com.paint.backend.Service.Database;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/paint")
public class Controller {

    private final Database database;

    public Controller(Database database) { this.database = database; }

    @GetMapping("/create")
    @ResponseBody
    public int createShape(@RequestBody String ShapeData){
        return database.add(ShapeData);
    }

    @PostMapping("/update/{ID}")
    @ResponseBody
    public void update(@PathVariable("ID") int ID,@RequestBody String ShapeUpdate){
        database.update(ID,ShapeUpdate);
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
