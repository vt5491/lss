import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
//import { AsterhedraComponent } from './asterhedra/asterhedra.component';
import { LoopySurfaceSurfersComponent } from './loopy-surface-surfers/loopy-surface-surfers.component';
//import { PlaneSceneComponent } from './asterhedra/scenes/plane-scene';
import { PlaneSceneComponent } from './asterhedra/scenes/plane-scene/plane-scene.component';
//import { LuxorSceneComponent } from './asterhedra/scenes/luxor-scene/luxor-scene.component';
import { LuxorSceneComponent } from './loopy-surface-surfers/scenes/luxor-scene/luxor-scene.component';
//vt add
import {RouterModule, Routes} from '@angular/router';
//vt end
//vt add
const appRoutes:Routes = [ 
  //{path: '**', component: LuxorSceneComponent} 
  //{path: '**', component: LoopySurfaceSurfersComponent},
  {path: '', component: LoopySurfaceSurfersComponent},
  {path: 'luxorScene', component: LuxorSceneComponent} 
];
import { BaseService  } from './services/base.service';
import { AsteroidsGame  } from './inner-games/asteroids/asteroids-game';
import { AsteroidsKbdHandler  } from './inner-games/asteroids/asteroids-kbd-handler';
import { Ship  } from './inner-games/asteroids/ship';
import { Asteroid  } from './inner-games/asteroids/asteroid';
import { ThreeJsSceneProvider, UtilsService,
 ThreeJsWebGLRendererProvider,
 //EmptyParmsServiceProvider
} from './services/utils.service';


//vt end

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
    //vt add
    RouterModule.forRoot(appRoutes),
    //vt end
    FormsModule,
    HttpModule
  ],
  providers: [
    //vt add
    BaseService,
    //KbdHandlerRouterService,
    //CameraKbdHandlerService,
    AsteroidsKbdHandler,
    Ship,
    AsteroidsGame,
    UtilsService,
    ThreeJsSceneProvider,
    //vt end
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
