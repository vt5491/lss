// Note: atom editor can't find the index.d.ts when started from anything other
// than the root dir (e.g. the one at the package.json level), thus we still need
// to rely on a reference path in the case that we start atom from a sub-folder.
/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
// import {} from 'jasmine';
import { TestBed, inject } from '@angular/core/testing';
// import { ValueProvider, FactoryProvider, ExistingProvider} from '@angular/core';
import {Injector} from '@angular/core';

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
    // el.addEventListener('loaded', function (e) {
    //   // done();
    //   console.log(`entity is loaded`);
    //   debugger;
    // }).bind(this);

    // el.addEventListener('componentinitialized', function (evt) { if (evt.detail.name !== 'foo') { return; }
    //   console.log(`component initialized`);
    // // component = el.components.foo;
    // // done();
    // });

    // this.entity = document.createElement('a-entity');

    // this.fixture.el = el;
    // this.fixture.abc = 7;
    // this.abc =7;

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
      // done();
      // expect(this.el.getAttribute('ship-thrust-sound').tickInterval).toEqual(25);
      // assert(this.el.getAttribute('ship-thrust-sound').tickInterval).toEqual(25);
      // debugger
    // el.setAttribute('ship-thrust-sound', 'tickInterval', 30);
    // el.setAttribute('sound', 'src', 'url(anothersound.wav)');
    el.setAttribute('position', { x: 1, y: 2, z: 3 });
    // el.setAttribute('sound', {src: 'url(test.ogg)'});
    el.setAttribute('sound', 'src', 'url(/base/src/assets/sounds/horse.ogg)');
    el.setAttribute('sound', 'maxDistance', '17');
    let entity = this.entity = entityFactory();
    entity.setAttribute('asteroids-game-controller-listener', '');

    entity.appendChild(el);

  });

  it('should ...',(done) => inject([ShipThrustSoundService, UtilsService, BaseService,
    // AsteroidsGameControllerListenerService, AsteroidsGame
  ],
     (service: ShipThrustSoundService, utils: UtilsService, base: BaseService,
      //  agcl: AsteroidsGameControllerListenerService, asteroidsGame: AsteroidsGame
      // done: DoneFn
     ) => {
       expect(service).toBeTruthy();

       it('should fuck', (done) => {
         this.el.addEventListener('sound-loaded', (e) => {
           console.log(`sound is loaded`);
           this.el.setAttribute('ship-thrust-sound', {
             'tickInterval': 25,
           });
           expect(this.el.getAttribute('ship-thrust-sound').tickInterval).toEqual(25);
           done();
         });
       })
     }).bind(this)
  );


  // it('simple test', (done) => {
  //   expect().toBeTruthy();
  // })
      //  debugger;
       //  this.el.fadeOutWithStopOverride();
      //  let f = (service) => {
      //    return (e) => {
      //      let s = service;
       //
      //      console.log(`entity is loaded2`);
          //  debugger;
        //  }
      //  }
      //  this.el.addEventListener('loaded', function (e) {
      //  this.el.addEventListener('loaded', (e) => {
      //    // done();
      //    console.log(`entity is loaded`);
      //    debugger;
      //  });
        // this.el.addEventListener('loaded', f(service));
});

fdescribe('Ship-thrust-sound2', () => {
  let utils: UtilsService;
  let base: BaseService;
  let stss: ShipThrustSoundService;

  console.log('stss: top part');
  // beforeEach(
  beforeAll(
    // async(
      () => {
        console.log('stss: beforeEach: entered');
        // TestBed.configureTestingModule({
        // })
        // debugger;
        this.base = new BaseService();
        this.utils = new UtilsService(this.injector, base);
        this.stss = new ShipThrustSoundService(this.utils, this.base);

        let el  = this.el = entityFactory();

        el.setAttribute('ship-thrust-sound');
        el.setAttribute('ship-thrust-sound', 'tickInterval', 30);
        el.setAttribute('position', { x: 1, y: 2, z: 3 });
        el.setAttribute('sound', 'src', 'url(/base/src/assets/sounds/horse.ogg)');
        el.setAttribute('sound', 'maxDistance', '17');

        let entity = this.entity = entityFactory();
        entity.setAttribute('asteroids-game-controller-listener', '');

        entity.appendChild(el);
        el.addEventListener('loaded', (e) => {
          // done();
          console.log(`entity is loaded`);
          // debugger;
        });
      }
    // )
  )

  // it('simple test', () => {
  //   expect(this.stss).toBeTruthy();
  // })

  // it('simple delay', (done) => {
  //   setTimeout(() =>{
  //     console.log("Hello");
  //     expect(this.stss).toBeTruthy();
  //     done();
  //   }, 100);
  // })

  it('should hopefully work', (done) => {

    this.el.addEventListener('sound-loaded', (e) => {
      console.log(`sound is loaded`);
      // debugger;
      this.el.setAttribute('ship-thrust-sound', {
        'tickInterval': 25,
      });
      expect(this.el.getAttribute('ship-thrust-sound').tickInterval).toEqual(25);
      done();
    });
  })
})
