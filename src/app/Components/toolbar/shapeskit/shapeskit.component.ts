import { Component, Input, OnInit} from '@angular/core';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-shapeskit',
  templateUrl: './shapeskit.component.html',
  styleUrls: ['./shapeskit.component.css']
})
export class ShapeskitComponent implements OnInit {
  
  @Input() shapeColor?:string;

  private data: DataService;

  constructor(dataService : DataService) { 
    this.data = dataService;
  }

  ngOnInit(): void {
  }

  drawCircle(){
    this.data.setValue("circle");
  };

  drawEllipse(){
    this.data.setValue("ellipse");
  };

  drawSquare(){
    this.data.setValue("square");
  };

  drawRect(){
    this.data.setValue("rectangle");
  };
}
