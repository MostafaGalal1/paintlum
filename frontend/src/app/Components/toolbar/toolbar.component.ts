import { Component, OnInit } from '@angular/core';
import Konva from 'konva';
import {DataService} from "../../Services/data.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  protected strokeColor: string = "#000000";
  protected fillColor: string = "transparent";
  protected strokeWidth: string = "5";

  private data: DataService;
  un_url: string = "http://localhost:8080/paint/"; 

  constructor(dataService: DataService) {
    this.data = dataService;
  }

  ngOnInit(): void {
  }

  selectedFile!: File;
  newFile!: FileSystemFileHandle;
  pickerOpts: FilePickerOptions = {
    types: [
      {
        description: 'Paints',
        accept: {
          'paints/*': ['.JSON', '.xml'],
        },
      },
    ],
    excludeAcceptAllOption: true,
  };

  async load() {
    let stage:Konva.Circle;
    let fileHandle: FileSystemFileHandle;
    [fileHandle] = await window.showOpenFilePicker(this.pickerOpts);
    console.log(fileHandle);
    if (fileHandle.kind === 'file') {
      this.selectedFile = await fileHandle.getFile();
      console.log(JSON.stringify(this.selectedFile));
      fetch('./assets/p.JSON')
        .then((response) => response.json())
        .then((json) => {stage = Konva.Node.create(json)
        console.log(stage);});
    }
  }

  private stage:Konva.Circle = new Konva.Circle({x:43, y:43, fill:'red', stroke:'black', strokeWidth:12, draggable:true})
  
  async save() {
    var blob = new Blob([this.stage.toJSON()], { type: 'text/plain' });
    this.selectedFile = new File([blob], "", {type: "text/plain"});
    this.newFile = await window.showSaveFilePicker({
      types: [
        {
          description: 'Paints',
          accept: {
            'paints/*': ['.JSON', '.xml'],
          },
        },
      ],
      excludeAcceptAllOption: true,
      suggestedName: 'paint.JSON',
    });
    const writableStream = await this.newFile.createWritable();
    await writableStream.write(this.selectedFile);
    await writableStream.close();
  }

  async undo() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.un_url + 'undo', false);
    xhr.send();
    
    if (xhr.response === "empty"){
      console.log('empty');
      return;
    } else {
      const obj = JSON.parse(xhr.response);
      if (obj.hasOwnProperty("delete")){
        this.data.setDelete(obj.delete);
      } else
        this.data.setShape(xhr.response);
    }
  }

  async redo() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.un_url + 'redo', false);
    xhr.send();

    if (xhr.response === "empty"){
      console.log('empty');
      return;
    } else {
      const obj = JSON.parse(xhr.response);
      if (obj.hasOwnProperty("delete")){
        this.data.setDelete(obj.delete);
      } else
        this.data.setShape(xhr.response);
    }
  }

  erase(){

  }

  remove(){
    var xhr = new XMLHttpRequest();
    var pack: string;
    var un_data: any;

    un_data = {
        "ID": 786867
    };

    pack =  Object.keys(un_data).map(function (key) { return [key, un_data[key]].map(encodeURIComponent).join("="); }).join("&");

    xhr.open("GET", this.un_url + 'delete' + '?' + pack, false);
    xhr.send();
    
    console.log(xhr.response);
  }

  select(){
    this.data.setValue('select');
  }

  pickStrokeColor() {
    this.data.setStrokeColor(this.strokeColor);
  }

  pickFillColor() {
    this.data.setFillColor(this.fillColor);
  }

  pickStrokeWidth(event : any) {
      this.strokeWidth = event.target.value;
      this.data.setsetstrokeWidth(this.strokeWidth);
  }
}

