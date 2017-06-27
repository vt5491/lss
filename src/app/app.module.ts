import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
//import { AsterhedraComponent } from './asterhedra/asterhedra.component';
import { LoopySurfaceSurfersComponent } from './loopy-surface-surfers/loopy-surface-surfers.component';
//import { PlaneSceneComponent } from './asterhedra/scenes/plane-scene';
// import { PlaneSceneComponent } from './asterhedra/scenes/plane-scene/plane-scene.component';
//import { LuxorSceneComponent } from './asterhedra/scenes/luxor-scene/luxor-scene.component';
import { LuxorSceneComponent } from './loopy-surface-surfers/scenes/luxor-scene/luxor-scene.component';
import { PlaneSceneComponent } from './loopy-surface-surfers/scenes/plane-scene/plane-scene.component';
//vt add
import {RouterModule, Routes} from '@angular/router';
//vt end
//vt add
const appRoutes:Routes = [ 
  //{path: '**', component: LuxorSceneComponent} 
  //{path: '**', component: LoopySurfaceSurfersComponent},
  {path: '', component: LoopySurfaceSurfersComponent},
  {path: 'luxorScene', component: LuxorSceneComponent},
  {path: 'planeScene', component: PlaneSceneComponent} 
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
import { GameSceneDirective } from './directives/game-scene.directive';
import { InnerSceneRendererService  } from './services/aframe/inner-scene-renderer.service';
//vt end

@NgModule({
  declarations: [
    AppComponent,
 //   AsterhedraComponent,
    LoopySurfaceSurfersComponent,
    PlaneSceneComponent,
    LuxorSceneComponent,
    GameSceneDirective,
    //vt add
    // LuxorSceneComponent
    //vt end
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
    {
      provide: LuxorSceneComponent,
      // useFactory: (base, utils) => {
      //   return new Asteroid(base, utils, {});
      useFactory:  (asteroidsGame) => {
      // useFactory:  function() {
        return new LuxorSceneComponent(asteroidsGame);
      },
      // deps: [BaseService, UtilsService]
      deps: [AsteroidsGame]
    },
    // InnerSceneRendererService,
    //vt end
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
