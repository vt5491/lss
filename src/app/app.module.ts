import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
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
  {path: 'poolHallScene', component: PoolHallSceneComponent},
  {path: 'globeScene', component: GlobeSceneComponent},
  {path: 'cokeCanScene', component: CokeCanSceneComponent},
];
import { BaseService  } from './services/base.service';
import { AsteroidsGame  } from './inner-games/asteroids/asteroids-game';
import { AsteroidsKbdHandler  } from './inner-games/asteroids/asteroids-kbd-handler';
import { Ship  } from './inner-games/asteroids/ship';
import { Asteroid  } from './inner-games/asteroids/asteroid';
import { ThreeJsSceneProvider, UtilsService,
 ThreeJsWebGLRendererProvider,
} from './services/utils.service';
// import { GameSceneDirective } from './directives/game-scene.directive';
import { InnerSceneRendererService  } from './services/aframe/inner-scene-renderer.service';
import { AsteroidsGameControllerListenerService } from './inner-games/asteroids/aframe/asteroids-game-controller-listener.service';
import { OuterSceneService} from './services/outer-scene.service';
import { GlobeSceneComponent } from './loopy-surface-surfers/scenes/globe-scene/globe-scene.component';
import { CokeCanSceneComponent } from './loopy-surface-surfers/scenes/coke-can-scene/coke-can-scene.component';
import { ShipThrustSoundService} from './services/aframe/ship-thrust-sound.service';
import { AfAssetsComponent } from './inner-games/asteroids/af-assets/af-assets.component';

@NgModule({
  declarations: [
    AppComponent,
    LoopySurfaceSurfersComponent,
    PlaneSceneComponent,
    LuxorSceneComponent,
    // GameSceneDirective,
    PoolHallSceneComponent,
    GlobeSceneComponent,
    CokeCanSceneComponent,
    AfAssetsComponent,
    //AsteroidsGame,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {useHash: false}),
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
      useFactory: (asteroidsGame, baseService, utilsService, outerSceneService) => {
        return new LuxorSceneComponent(asteroidsGame, baseService, utilsService, outerSceneService);
      },
      deps: [AsteroidsGame, BaseService, UtilsService, OuterSceneService]
    },
    {
      provide: PlaneSceneComponent,
      useFactory:(asteroidsGame, outerSceneService, baseService, utilsService) => {
        return new PlaneSceneComponent(asteroidsGame, outerSceneService,
          baseService, utilsService);
      },
      deps: [AsteroidsGame, OuterSceneService, BaseService, UtilsService]
    },
    // {
    //   provide: ShipThrustSoundService,
    //   useFactory: (utilsService) => {
    //     return new ShipThrustSoundService(utilsService)
    //   },
    //   deps: [UtilsService],
    // },
    // {
    //   provide: LuxorSceneComponent,
    //   useFactory:(asteroidsGame, asteroidsGameControllerListenerService)  => {
    //     return new LuxorSceneComponent(asteroidsGame, asteroidsGameControllerListenerService);
    //   },
    //   deps: [AsteroidsGame, AsteroidsGameControllerListenerService]
    //   // deps: [AsteroidsGame]
    // },
  ],
  entryComponents: [AppComponent, PlaneSceneComponent],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  // schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
