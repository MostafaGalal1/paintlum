import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './Components/toolbar/toolbar.component';
import { ButtonComponent } from './Components/toolbar/button/button.component';
import { ShapeskitComponent } from './Components/toolbar/shapeskit/shapeskit.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { DrawDirective } from './Components/toolbar/shapeskit/Directives/draw.directive';
import { KonvaModule } from "ng2-konva";

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    ButtonComponent,
    ShapeskitComponent,
    DrawDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ColorPickerModule,
    KonvaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
