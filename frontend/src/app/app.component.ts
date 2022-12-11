import { Component, OnInit, ViewChild } from '@angular/core';
import { KonvaComponent } from 'ng2-konva';
import { Observable, of } from 'rxjs';
import { DataService } from './Services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'paintlum';
  public deletion?:string;
  public shapeUpdate?:string;
  public shape?:string;
  public strokeColor?:string;
  public fillColor?:string;
  public strokeWidth?:string;

  constructor(private dataService:DataService){  }

  ngOnInit() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8080/paint/restart" , false);
    xhr.send();
    
    this.dataService.getValue().subscribe((val) => this.shape = val);
    this.dataService.getStrokeColor().subscribe((sCl) => this.strokeColor = sCl);
    this.dataService.getFillColor().subscribe((fCl) => this.fillColor = fCl);
    this.dataService.getStrokeWidth().subscribe((stW) => this.strokeWidth = stW);
    this.dataService.getShape().subscribe((shP) => this.shapeUpdate = shP);
    this.dataService.getDelete().subscribe((deL) => this.deletion = deL);
  }
}
