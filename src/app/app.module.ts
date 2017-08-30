import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoopySurfaceSurfersComponent } from './loopy-surface-surfers/loopy-surface-surfers.component';
import { LuxorSceneComponent } from './loopy-surface-surfers/scenes/luxor-scene/luxor-scene.component';
import { PlaneSceneComponent } from './loopy-surface-surfers/scenes/plane-scene/plane-scene.component';
import { PoolHallSceneComponent } from './loopy-surface-surfers/scenes/pool-hall-scene/pool-hall-scene.component';
import {RouterModule, Routes} from '@angular/router';

const appRoutes:Routes = [ 
  {path: '', component: LoopySurfaceSurfersComponent},
  {path: 'luxorScene', component: LuxorSceneComponent},
  {path: 'planeScene', component: PlaneSceneComponent}, 
  {path: 'poolHallScene', component: PoolHallSceneComponent} 
];
import { BaseService  } from './services/base.service';
import { AsteroidsGame  } from './inner-games/asteroids/asteroids-game';
import { AsteroidsKbdHandler  } from './inner-games/asteroids/asteroids-kbd-handler';
import { Ship  } from './inner-games/asteroids/ship';
import { Asteroid  } from './inner-games/asteroids/asteroid';
import { ThreeJsSceneProvider, UtilsService,
 ThreeJsWebGLRendererProvider,
} from './services/utils.service';
import { GameSceneDirective } from './directives/game-scene.directive';
import { InnerSceneRendererService  } from './services/aframe/inner-scene-renderer.service';
import { AsteroidsGameControllerListenerService } from './inner-games/asteroids/aframe/asteroids-game-controller-listener.service';
import { OuterSceneService} from './services/outer-scene.service';

@NgModule({
  declarations: [
    AppComponent,
    LoopySurfaceSurfersComponent,
    PlaneSceneComponent,
    LuxorSceneComponent,
    GameSceneDirective,
    PoolHallSceneComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpModule
  ],
  providers: [
    BaseService,
    AsteroidsKbdHandler,
    Ship,
    AsteroidsGame,
    UtilsService,
    ThreeJsSceneProvider,
    OuterSceneService,
    // AsteroidsGameControllerListenerService,
    // {
    //   provide: AsteroidsGameControllerListenerService,
    //   useFactory: (asteroidsGame, baseService) => {
    //     return new AsteroidsGameControllerListenerService(asteroidsGame, baseService)
    //   },
    //   deps: [AsteroidsGame, BaseService]
    // },
    {
      provide: LuxorSceneComponent,
      useFactory:(asteroidsGame)  => {
        return new LuxorSceneComponent(asteroidsGame);
      },
      deps: [AsteroidsGame]
    },
    // {
    //   provide: LuxorSceneComponent,
    //   useFactory:(asteroidsGame, asteroidsGameControllerListenerService)  => {
    //     return new LuxorSceneComponent(asteroidsGame, asteroidsGameControllerListenerService);
    //   },
    //   deps: [AsteroidsGame, AsteroidsGameControllerListenerService]
    //   // deps: [AsteroidsGame]
    // },
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
