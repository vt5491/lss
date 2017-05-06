import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
//import { AsterhedraComponent } from './asterhedra/asterhedra.component';
import { LoopySurfaceSurfersComponent } from './loopy-surface-surfers/loopy-surface-surfers.component';
//import { PlaneSceneComponent } from './asterhedra/scenes/plane-scene';
import { PlaneSceneComponent } from './asterhedra/scenes/plane-scene/plane-scene.component';
import { LuxorSceneComponent } from './asterhedra/scenes/luxor-scene/luxor-scene.component';

@NgModule({
  declarations: [
    AppComponent,
 //   AsterhedraComponent,
    LoopySurfaceSurfersComponent,
    PlaneSceneComponent,
    LuxorSceneComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
