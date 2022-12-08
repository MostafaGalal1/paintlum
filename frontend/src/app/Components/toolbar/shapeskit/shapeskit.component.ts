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

  drawShape(shape:string){
    this.data.setValue(shape);
  }

}
