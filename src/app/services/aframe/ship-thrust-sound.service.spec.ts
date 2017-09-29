import { TestBed, inject } from '@angular/core/testing';
// import { ValueProvider, FactoryProvider, ExistingProvider} from '@angular/core';

import { ShipThrustSoundService } from './ship-thrust-sound.service';
import { UtilsService, ThreeJsSceneProvider } from '../../services/utils.service';
import { BaseService } from '../../services/base.service';
import { AsteroidsGameControllerListenerService} from '../../inner-games/asteroids/aframe/asteroids-game-controller-listener.service';
import { AsteroidsGame } from '../../inner-games/asteroids/asteroids-game';
var entityFactory = require('../../../assets/components/helpers').entityFactory;
// var el;

// let ElProvider: FactoryProvider = {
//   provide: el,
//   useFactory: () => {
//     // return el;
//     return {};
//   },
//   deps: []
// };
// const provider: ExistingProvider = {provide: 'someToken', useExisting: 'someOtherToken'};

fdescribe('ShipThrustSoundService', () => {
  // const provider: ValueProvider = {provide: 'someToken', useValue: 'someValue'};
  // const ElProvider: ValueProvider = {provide: 'el', useValue: 'hi'};
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShipThrustSoundService, UtilsService, BaseService,
        AsteroidsGameControllerListenerService
          // {provide: el, useValue: 7}
      ]
    });
    // let agcl = new AsteroidsGameControllerListenerService
    let el  = this.el = entityFactory();
    el.setAttribute('ship-thrust-sound', {
      autoplay: true,
      position: [1, 2, 3]
    });
    // el.setAttribute('sound', 'src', 'url(anothersound.wav)');
    let entity = this.entity = entityFactory();
    entity.setAttribute('asteroids-game-controller-listener', '');

    // el.addEventListener('loaded', function (e) {
    //   // done();
    //   console.log(`entity is loaded`);
    //   debugger;
    // }).bind(this);

    el.addEventListener('componentinitialized', function (evt) { if (evt.detail.name !== 'foo') { return; }
      console.log(`component initialized`);
    // component = el.components.foo;
    // done();
  });

    // this.entity = document.createElement('a-entity');

    // this.fixture.el = el;
    // this.fixture.abc = 7;
    // this.abc =7;
  });

  it('should ...', inject([ShipThrustSoundService, UtilsService, BaseService,
    // AsteroidsGameControllerListenerService, AsteroidsGame
  ],
     (service: ShipThrustSoundService, utils: UtilsService, base: BaseService,
      //  agcl: AsteroidsGameControllerListenerService, asteroidsGame: AsteroidsGame
     ) => {
       expect(service).toBeTruthy();
      //  debugger;
       //  this.el.fadeOutWithStopOverride();
       let f = (service) => {
         return (e) => {
           let s = service;

           console.log(`entity is loaded2`);
           debugger;
         }
       }
      //  this.el.addEventListener('loaded', function (e) {
      //  this.el.addEventListener('loaded', (e) => {
      //    // done();
      //    console.log(`entity is loaded`);
      //    debugger;
      //  });
        this.el.addEventListener('loaded', f(service));
     }).bind(this)
  );
});
