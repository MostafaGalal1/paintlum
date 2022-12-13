import {ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges} from '@angular/core';
import axios from 'axios';
import Konva from 'konva';
import {DataService} from "../../Services/data.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() strokeColor: string = "#000000";
  @Input() fillColor: string = "transparent";
  @Input() strokeWidth: string = "5";

  private data: DataService;
  un_url: string = "http://localhost:8080/paint/";

  constructor(dataService: DataService) {
    this.data = dataService;
  }

  ngOnInit(): void {}

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

  async save() {
    var blob;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.un_url + 'save?fileType=json', false);
    xhr.send();

    blob = xhr.response;
    var JSONFile = new File([blob], "", {type: "text/plain"});

    xhr.open("GET", this.un_url + 'save?fileType=xml', false);
    xhr.send();

    blob = xhr.response;
    var XMLFile = new File([blob], "", {type: "text/plain"});

    this.newFile = await window.showSaveFilePicker({
      types: [
        {
          description: 'paints',
          accept: {
            'paints/*': ['.JSON', '.xml'],
          },
        },
      ],
      excludeAcceptAllOption: true,
      suggestedName: 'drawing',
    });

    const writableStream = await this.newFile.createWritable();
    console.log(this.newFile.name);
    if (this.newFile.name.indexOf("xml") !== -1) {
      await writableStream.write(XMLFile);
    } else { 
      await writableStream.write(JSONFile);
    }
    await writableStream.close();
  }

  private stage:Konva.Circle = new Konva.Circle({x:43, y:43, fill:'red', stroke:'black', strokeWidth:12, draggable:true})

  load (e:any){
    let currentInput = e.target.files;
    if (currentInput.length === 0) {
      return
    }
    let file = currentInput[0];
    let fileName = file.name;
    let regex = new RegExp('[^.]+$');
    let extension = fileName.match(regex);
    console.log(extension);

    if (currentInput[0] == null) {
      return
    }
    let formData = new FormData();
    formData.append("file", file);
    formData.append("ext", extension);

    axios.post(this.un_url + "file", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(Response => {this.data.setUpShape(Response.data)});
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
      } else if (obj.hasOwnProperty("create")) {
          this.data.setKonvaShape(obj.create);
      } else if (obj.hasOwnProperty("update")) {
          this.data.setUpShape(obj.update);
      }
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
        } else if (obj.hasOwnProperty("create")) {
            this.data.setKonvaShape(obj.create);
        } else if (obj.hasOwnProperty("update")) {
            this.data.setUpShape(obj.update);
        }
    }
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

