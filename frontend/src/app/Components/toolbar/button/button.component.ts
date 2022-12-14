import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  @Input() btnShape?: string;
  @Input() btnClass?: string;
  @Input() btnText?: string;
  @Input() btnTitle?: string;
  @Output() btnClick = new EventEmitter();

  constructor() {}

  ngOnInit(): void { }

  onClick() {
    this.btnClick.emit(this.btnShape);
  }
}
