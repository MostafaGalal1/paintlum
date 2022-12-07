import { Component, Input, OnInit } from '@angular/core';
import Konva from 'konva';
import { stages } from 'konva/lib/Stage';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  color: any;
  constructor() {   }

  ngOnInit(): void {
  }

  save(){
  }

  load(){
  }
}
