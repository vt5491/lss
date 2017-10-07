import { Injectable, EventEmitter, Output } from '@angular/core';
import { AsteroidsGame } from '../asteroids-game'
import { BaseService } from '../../../services/base.service';
import { UtilsService } from '../../../services/utils.service';
import * as $ from 'jquery';

//Vive original: gripdown -> fire bullet
//             : triggerdown -> thrust 

@Injectable()
export class AsteroidsGameControllerListenerService {
  public touchOn : boolean;
  public thrusterEngaged : boolean;
  public lastTouchPadTheta : number;
  public utils: UtilsService;
  private afc : Object;
  private spaceRumble : HTMLElement;

  constructor(
    asteroidsGame: AsteroidsGame, 
    base: BaseService,
    utils: UtilsService
  ) {
    let angParentComponent = this;
    //Note: apprently 'this' is not fully defined until the ctor completes.  And the aframe
    // component defintion, uses the 'this' as it exists at the time of its defintion (in this ctor).
    // Thus, we have to build up 'angParentComponent' manually, and we have to add to it without
    // specifying 'this' e.g 'utils' not 'this.utils'
    angParentComponent.utils = utils;

    angParentComponent.afc = AFRAME.registerComponent('asteroids-game-controller-listener', 
    {
      schema : { 
        shipRotFactor: {type : 'number', default: 1},
        fireSoundStartCount: {type: 'number', default: 0},
        fireSoundStopCount: {type: 'number', default: 0},
        spaceRumble: {type: 'audio'},
        bgSound: {type: 'audio'}
      },
      init: function () {
        var el = this.el;
        this.projEl = document.querySelector('#proj-entity') as AFrame.Entity;
        this.data.fireSoundStartCount = 0;
        this.data.fireSoundStopCount = 0;
        // this.projEl.setAttribute('sound', {
        //   src: 'url(assets/sounds/asteroids/asteroids-ship-fire.wav)',
        //   on: 'fire-bullet',
        //   volume: 0.25,
        //   poolSize: 20
        // });

        //TODO next line is redundant
        base.docLSS['ship-thrust-reset'] = false;
        this.data.spaceRumble = document.getElementById('space-rumble');
        this.data.spaceRumble.volume = 0.1;
        angParentComponent.spaceRumble = this.data.spaceRumble;
        this.data.bgSound = document.getElementById('bg-sound');
        this.data.bgSound.volume = 0.02;
        // this.thrustSound = this.el.components.sound__thrust;
        // this.projEl : AFrame.Entity
        this.thrustSound = this.projEl.components.sound__thrust;
        this.data.bgSound.play();
        this.data.spaceRumble.addEventListener('ship-thrust-reset', () => {
          // set a global variable so others can know.
          (document as any).LSS['ship-thrust-reset'] = true;
        });
        // el.addEventListener('thrust-start', () => {
        //   // debugger;
        //   console.log(`AGCLS: caught thrust-start`);
        // })
        //tween compatible thrust handlers
        el.addEventListener('thrust-start', () => {
          this.thrustSound.stopSound();
          // this.sound.pool.children[0].setVolume(1.0);
          // factory.volume = {vol: 1.0}; //need to do this every time
          let initVol = this.thrustSound.data.volume;
          this.volume = {vol: initVol}; //need to do this every time
          this.thrustSound.pool.children[0].setVolume(initVol);
          console.log(`onClick: volume=${this.thrustSound.pool.children[0].getVolume()}`);
          this.thrustSound.currentTime = 0.0;
          if( this.tween) {
            this.tween.stop();
          }
          this.thrustSound.playSound();
        });
        el.addEventListener('thrust-stop', () => {
          let sound = this.thrustSound;

          this.tween = new TWEEN.Tween(this.volume);
          // this.tween.easing(TWEEN.Easing.Sinusoidal.In);
          this.tween.to(
            { vol: 0.0 }
            , 500);
          this.tween.onUpdate(function (obj) {
            // console.log(`onUpdate: this.vol=${this.vol}`);
            sound.pool.children[0].setVolume(this.vol);
            // console.log(`onUpdate: pool.children[0].getVolume=${sound.pool.children[0].getVolume()}`);
          });
          this.tween.onComplete(function () {
            sound.stopSound();
            console.log(`tween is done`);
          });

          this.tween.start();
        });
        // el.addEventListener('thrust-start', () => {
        //   let el = this.el;

        //   console.log(`agcls.thrust-start listener: dispatching thrustComp.playSound`);
          
        //   let thrustComp = el.components.sound__thrust;
        //   // stop any prior fade outs
        //   // thrustComp.stopSound();
        //   // debugger;
        //   if (thrustComp.isPlaying) {
        //     thrustComp.stopSound();
        //   }
        //   // and restart it anew.
        //   thrustComp.playSound();
        // });
        //non-tween thrust-stop
        // el.addEventListener('thrust-stop', () => {
        //   let el = this.el;

        //   console.log(`agcls.thrust-stop listener: dispatching thrustComp.stopSound`);
        //   let thrustComp = el.components.sound__thrust;
        //   thrustComp.stopSound(); //note: generates distinctive "pop"
        //   // thrustComp.fadeOut();
        // });

        // thust-start and thrust-stop now handled by ship-thrust-sound-service
        // el.addEventListener('thrust-start', ()=> {
        //   let sound = this.data.spaceRumble;
        //   sound.currentTime = 0.0;
        //   // console.log(`thrust-stop: emitting ship-thrust-reset event`);
        //   let rumbleEl = angParentComponent.spaceRumble; 
        //   let thrustResetEvt = document.createEvent('Event');
        //   thrustResetEvt.initEvent('ship-thrust-reset', true, true);
        //   rumbleEl.dispatchEvent(thrustResetEvt);
        //   angParentComponent.utils.fadeIn(sound, 250, 0.20, 25);
        // });

        // el.addEventListener('thrust-stop', () => {
        //   angParentComponent.utils.fadeOut(this.data.spaceRumble, 1000, 0.0, 25);
        // })

        el.addEventListener('sound-ended', ()=> {
          this.data.fireSoundStopCount++;
          // console.log(`fireSoundStartCount=${this.data.fireSoundStartCount}, fireSoundStopCount=${this.data.fireSoundStopCount}`);
        });
        el.addEventListener('sound-loaded', ()=> {console.log('sound loaded')});

        el.addEventListener('buttondown', function (e) {
          // console.log(`AsteroidsGameControllerListenerService.AFRAME.init: buttondown event: e=${e}`);
        });
        el.addEventListener('trackpaddown', function (e) {
          // console.log(`AsteroidsGameControllerListenerService.AFRAME.init: buttondown event: e=${e}`);
          asteroidsGame.shipFiredBullet();
        });
        // el.addEventListener('gripdown', function (e) { //Vive
        el.addEventListener('gripdown', (e) => { 
          // el.emit('fire-bullet');
          this.projEl.emit('fire-bullet');
          this.data.fireSoundStartCount++;
          asteroidsGame.shipFiredBullet();
        });
        el.addEventListener('touchstart',  (e) => {
          // console.log(`AsteroidsGameControllerListenerService.AFRAME.touchstart: ship.theta=${asteroidsGame.ship.theta}`);
          angParentComponent.touchOn = true;
        });
        el.addEventListener('touchend', (e) => {
          // console.log(`AsteroidsGameControllerListenerService.AFRAME.touchend: ship.theta=${asteroidsGame.ship.theta}`);
          angParentComponent.touchOn = false;
        });
        el.addEventListener('axismove', (e) => {
          // console.log(`AsteroidsGameControllerListenerService.AFRAME.init: axismove event: e=${e}`);
          if (angParentComponent.touchOn) {
            var horizAxis = e.detail.axis[0];
            var upAxis = e.detail.axis[1];
            var theta = -Math.atan2(e.detail.axis[0], e.detail.axis[1]);
            // round to tenths to reduce sensitivity
            theta = Number(theta.toFixed(1));
            // console.log(`Listener: this.shipRotFactor=${this.data.shipRotFactor}`);
            

            if (theta > 0) {
              asteroidsGame.ship.theta -= this.data.shipRotFactor * base.ONE_DEG * (asteroidsGame.shipRotFactor - 1);
            }
            else if (theta < 0) {
              asteroidsGame.ship.theta += this.data.shipRotFactor * base.ONE_DEG * (asteroidsGame.shipRotFactor - 1);
            }
          }
        });
        el.addEventListener('triggerdown', function (e) {
          console.log(`AGCLS: now emitting thrust-start`);
          angParentComponent.thrusterEngaged = true;
          el.emit('thrust-start');
        });
        el.addEventListener('triggerup', (e) => { //Vive
          angParentComponent.thrusterEngaged = false;
          console.log(`AGCLS: now emitting thrust-stop`);
          
          el.emit('thrust-stop');
        });
      },
      tick: () => {
        if (angParentComponent.thrusterEngaged) {
          // I don't know why I have to add 90 deg, but I do as empirically determined
          asteroidsGame.ship.vx += asteroidsGame.ship.deltaVx * Math.cos(asteroidsGame.ship.theta + Math.PI / 2.0) * 0.2;

          asteroidsGame.ship.vy += asteroidsGame.ship.deltaVy * Math.sin(asteroidsGame.ship.theta + Math.PI / 2.0) * 0.2;

          // and emit an event for any observers who may need to respond to this
          // this.shipMove.emit(null);
        }
        TWEEN.update();
      }
    })
  }

}
