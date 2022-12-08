import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './Components/toolbar/toolbar.component';
import { ButtonComponent } from './Components/toolbar/button/button.component';
import { ShapeskitComponent } from './Components/toolbar/shapeskit/shapeskit.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { DrawDirective } from './Components/toolbar/shapeskit/Directives/draw.directive';

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
    ColorPickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
