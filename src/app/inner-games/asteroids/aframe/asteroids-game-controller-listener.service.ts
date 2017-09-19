import { Injectable, EventEmitter, Output } from '@angular/core';
import { AsteroidsGame } from '../asteroids-game'
import { BaseService } from '../../../services/base.service';
import { UtilsService } from '../../../services/utils.service';
// import $ from 'jquery';
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
  // @Output() shipMove: EventEmitter<any> = new EventEmitter();

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
    // let touchOn : boolean;
    // let thrusterEngaged: boolean;

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
        console.log(`AsteroidsGameControllerListenerService.AFRAME.init: entered..`);
        var el = this.el;
        //vt add
        // debugger;
        // let sky = document.getElementById('sky');
        // let cylEl = (document.getElementById('aframe-cyl') as any).object3D.el;
        // cylEl.setAttribute('sound', {
        //   src: 'url(src/assets/sounds/asteroids/asteroids-ship-fire.ogg',
        //   on: 'fire-bullet',
        //   volume: 0.5,
        //   poolSize: 20
        // });
        // debugger;
        // let projObj = document.getElementsByClassName('proj-obj');
        // let f = (e : MouseEvent) => {console.log('you clicked on sky')};
        // // sky.onclick = f;
        // sky.onclick = function (){ console.log('hi from click')};
        // sky.addEventListener('click', function (evt) {'hi from click2' });
        // projObj.addEventListener('click', function (evt) {'hi from click2' });
        // debugger;
        // this.el.addEventListener('shoot', ()=> {console.log('hi from shoot')});
        // this.el.addEventListener('shoot');
        // debugger;
        this.data.fireSoundStartCount = 0;
        this.data.fireSoundStopCount = 0;
        this.el.setAttribute('sound', {
          // src: 'url(assets/sounds/gun.ogg)',
          // src: 'url(assets/sounds/asteroids/gun.ogg)',
          // src: 'url(assets/sounds/asteroids/asteroids-ship-fire.ogg)',
          src: 'url(assets/sounds/asteroids/asteroids-ship-fire.wav)',
          // src: 'url(assets/sounds/asteroids/fire_orig.wav)',
          // src: 'url(assets/sounds/asteroids/thrust_orig.wav)',
          // src: 'url(assets/sounds/space-rumble.wav)',
          // works
          // src: 'url(assets/sounds/asteroids/space-rumble.ogg)',
          // src: document.getElementById('space-rumble'),
          // src: 'url(../../../../assets/sounds/gun.ogg)',
          // src: 'url(../../../../assets/sounds/asteroids-ship-fire.ogg)',
          on: 'fire-bullet',
          volume: 0.25,
          poolSize: 20
        });
        // debugger;
        // let d= $('#dolly');
        // console.log(`dolly.position.z=${d.attr('position')}`);
        // console.log(`dolly.before=${d.before}`);
        // let e = $(el)
        base.docLSS['ship-thrust-reset'] = false;
        this.data.spaceRumble = document.getElementById('space-rumble');
        this.data.spaceRumble.volume = 0.1;
        angParentComponent.spaceRumble = this.data.spaceRumble;
        this.data.bgSound = document.getElementById('bg-sound');
        this.data.bgSound.volume = 0.02;
        this.data.bgSound.play();
        // debugger;
        // console.log(`e.before=${e.before}`);
        // e.animate({volume: 0.9}, 100);
        // try to do a fade in
        // el.animate([{volume : 1.0}], [{duration: 100}]);
        // this.data.spaceRumble.onabort = () => {
        //   console.log('AsteroidsGameControllerListenerService: spaceRumble aborted');
        // }
        this.data.spaceRumble.addEventListener('ship-thrust-reset', () => {
          console.log('AsteroidsGameControllerListenerService: ship thrust reset');
          // set a global variable so others can know.
          (document as any).LSS['ship-thrust-reset'] = true;
        });
        el.addEventListener('thrust-start', ()=> {
          // this.data.spaceRumble.animate([{volume : 1.0}], [{duration: 1000}]);
          let sound = this.data.spaceRumble;
          // sound.volume = 1.0;
          sound.currentTime = 0.0;
          console.log(`thrust-stop: emitting ship-thrust-reset event`);
          let rumbleEl = angParentComponent.spaceRumble; 
          // angParentComponent.afc.data
          let thrustResetEvt = document.createEvent('Event');
          thrustResetEvt.initEvent('ship-thrust-reset', true, true);
          rumbleEl.dispatchEvent(thrustResetEvt);
          // sound.play();
          angParentComponent.utils.fadeIn(sound, 250, 0.20, 25);
        });

        el.addEventListener('thrust-stop', () => {
        // el.addEventListener('thrust-stop', function() {
          // this.utils.fadeOut(this.data.spaceRumble, 1000, 0, 50);
          // this.utils.fadeOut(this.data.spaceRumble);
          // debugger;
          // angParentComponent.utils.fadeOut(this.data.spaceRumble);
          angParentComponent.utils.fadeOut(this.data.spaceRumble, 1000, 0.0, 25);
          // this.data.spaceRumble.pause();

        })
        /*
        el.addEventListener('thrust-stop', ()=> {
          // var entity = document.querySelector('[sound]');
          // entity.components.sound.stopSound();
          // this.el.components.sound.stopSound();
          // this.data.spaceRumble.pause();
          // this.el.components.sound.pauseSound();
          // let e = $(el)
          // e.animate({volume: 0.0}, 500);
          let sound = this.data.spaceRumble;
          // Set the point in playback that fadeout begins. This is for a 2 second fade out.
          // var fadePoint = sound.duration - 2;
          var fadePoint = sound.currentTime;

          var fadeAudio = setInterval(function () {

            // Only fade if past the fade out point or not at zero already
            if ((sound.currentTime >= fadePoint) && (sound.volume != 0.0)) {
              // sound.volume -= 0.2;
              sound.volume = Math.max(0.0, sound.volume - 0.25);
            }
            // When volume at zero stop all the intervalling
            // if (sound.volume === 0.0) {
            if (sound.volume <= 0.0) {
              clearInterval(fadeAudio);
            }
          }, 100);
        });
        */
        el.addEventListener('sound-ended', ()=> {
          console.log('sound ended'); 
          this.data.fireSoundStopCount++;
          console.log(`fireSoundStartCount=${this.data.fireSoundStartCount}, fireSoundStopCount=${this.data.fireSoundStopCount}`);
        });
        el.addEventListener('sound-loaded', ()=> {console.log('sound loaded')});

        //vt end
        el.addEventListener('buttondown', function (e) {
          // console.log(`AsteroidsGameControllerListenerService.AFRAME.init: buttondown event: e=${e}`);
        });
        el.addEventListener('trackpaddown', function (e) {
          // console.log(`AsteroidsGameControllerListenerService.AFRAME.init: buttondown event: e=${e}`);
          asteroidsGame.shipFiredBullet();
        });
        // el.addEventListener('gripdown', function (e) { //Vive
        el.addEventListener('gripdown', (e) => { 
          // console.log(`AsteroidsGameControllerListenerService.AFRAME.init: buttondown event: e=${e}`);
          // console.log(`AsteroidsGameControllerListenerService.AFRAME.init: emitting shoot event`);
          el.emit('fire-bullet');
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
        // el.addEventListener('triggerdown', (e) => { // Vive
        // el.addEventListener('gripdown', (e) => {
          // console.log(`AsteroidsGameControllerListenerService.AFRAME.init: triggerdown event: e=${e}`);
          angParentComponent.thrusterEngaged = true;
          el.emit('thrust-start');
        });
        el.addEventListener('triggerup', (e) => { //Vive
          angParentComponent.thrusterEngaged = false;
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
      }
    })
  }

}
