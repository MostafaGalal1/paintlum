import { Component, Input, OnInit } from '@angular/core';
import Konva from 'konva';
import { stages } from 'konva/lib/Stage';
import {DataService} from "../../Services/data.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  protected color: string = "#FFFFFF";
  protected fillColor: string = "transparent";
  protected thickness: string = "5";

  private data: DataService;

  constructor(dataService: DataService) {
    this.data = dataService;
  }

  ngOnInit(): void {
  }

  save() {
  }

  load() {
  }

  pickColor() {
    this.data.setColor(this.color);
  }

  pickFillColor() {
    this.data.setFillColor(this.fillColor);
  }

  pickThickness(event : any) {
      this.thickness = event.target.value;
      this.data.setThickness(this.thickness);
  }

}

