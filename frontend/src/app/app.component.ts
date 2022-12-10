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
  public strokeColor?:string;
  public fillColor?:string;
  public strokeWidth?:string

  constructor(private dataService:DataService){  }

  ngOnInit() {
    this.dataService.getValue().subscribe((val) => this.shape = val);
    this.dataService.getStrokeColor().subscribe((sCl) => this.strokeColor = sCl);
    this.dataService.getFillColor().subscribe((fCl) => this.fillColor = fCl);
    this.dataService.getStrokeWidth().subscribe((stW) => this.strokeWidth = stW);
  }
}
