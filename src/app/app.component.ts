import { Component, OnInit } from '@angular/core';
import { DataService } from './Services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'paintlum';
  public shape?:string;
  public color?:string;
  public fillColor?:string;
  public thickness?:string

  constructor(private dataService:DataService){  }

  ngOnInit() {
    this.dataService.getValue().subscribe((val) => this.shape = val);
    this.dataService.getColor().subscribe((col) => this.color = col);
    this.dataService.getFillColor().subscribe((col) => this.fillColor = col);
    this.dataService.getThickness().subscribe((thickness) => this.thickness = thickness);
  }
}
