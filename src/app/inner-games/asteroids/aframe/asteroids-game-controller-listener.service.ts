import { Injectable, EventEmitter, Output } from '@angular/core';
import { AsteroidsGame } from '../asteroids-game';
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
  public asteroidsGame: AsteroidsGame;
  private afc : Object;
  private spaceRumble : HTMLElement;

  constructor(
    // angParentComponent.asteroidsGame: angParentComponent.asteroidsGame,
    base: BaseService,
    utils: UtilsService
  ) {
    let angParentComponent = this;
    //Note: apprently 'this' is not fully defined until the ctor completes.  And
    //the aframe component defintion, uses the 'this' as it exists at the time
    //of its defintion (in this ctor). Thus, we have to build up
    //'angParentComponent' manually, and we have to add to it without specifying
    //'this' e.g 'utils' not 'this.utils'
    angParentComponent.utils = utils;
    //Note: setting angParentComponent.asteroidsGame now has to be done by whoever instantiates
    // an 'angParentComponent.asteroidsGameControllerListenerService'
    // angParentComponent.angParentComponent.asteroidsGame = angParentComponent.asteroidsGame;

    // if (AFRAME.components['asteroids-game-controller-listener']) {
    //   angParentComponent.afc = AFRAME.components['asteroids-game-controller-listener']
    // }
    // debugger;
    // console.log(`agcl: component=${AFRAME.components['asteroids-game-controller-listener']}`);
    // angParentComponent.afc = AFRAME.components['asteroids-game-controller-listener'];
    // if (! angParentComponent.afc) {
    //  console.log(`agcl: allocating new agcl`);

    angParentComponent.afc = AFRAME.components['asteroids-game-controller-listener'] || AFRAME.registerComponent('asteroids-game-controller-listener',
    {
      schema : {
        shipRotFactor: {type : 'number', default: 1},
        fireSoundStartCount: {type: 'number', default: 0},
        fireSoundStopCount: {type: 'number', default: 0},
        spaceRumble: {type: 'audio'},
        bgSound: {type: 'audio'},
        thrustSound: {type: 'audio'},
        controllerType: {type: 'string'}
      },
      init: function () {
        var el = this.el;
        this.projEl = document.querySelector('#proj-entity') as AFrame.Entity;
        // throttle down the tick rate to increase performance, as the stuff
        // on our tick does not need to be called *every* frame.
        let tickInterval = 100;
        this.tick = (AFRAME.utils as any).throttleTick(this.tick, tickInterval, this);
        // scale up ship movement to over a default tickRate of 60hz = 16 ms.
        this.shipDeltaFactor = tickInterval / 16.0

        this.data.fireSoundStartCount = 0;
        this.data.fireSoundStopCount = 0;

        //TODO next line is redundant
        base.docLSS['ship-thrust-reset'] = false;
        this.data.spaceRumble = document.getElementById('space-rumble');
        this.data.spaceRumble.volume = 0.1;
        angParentComponent.spaceRumble = this.data.spaceRumble;
        //vt-x
        // this.data.bgSound = document.getElementById('bg-sound');
        // this.data.bgSound.volume = 0.04;
        // this.data.bgSound.loop = true;
        // this.data.bgSound.play();
        this.data.thrustSound = this.projEl.components.sound__thrust;
        this.data.spaceRumble.addEventListener('ship-thrust-reset', () => {
          // set a global variable so others can know.
          (document as any).LSS['ship-thrust-reset'] = true;
        });
        // debugger;
        // el.components[tracked-controls] not set at init time.
        // this.data.controllerType = angParentComponent.utils.getControllerType(this.el);
        // we can't define these functions at the a-frame component level because
        // then they're not accessible from event handler.  Thus we define locally to
        // init and them reference them via closures in the event handlers.
        let formatInfoText = (gameState) => {
          let gamePaused = angParentComponent.asteroidsGame.gamePaused;
          let text = 'value: ';

          if (gamePaused) {
            text += 'Paused\n';
          }
          else {
            text += '\n';
          }

          text +=
            `Score: ${gameState.score}
Active Asteroids: ${gameState.asteroidsRemaining}`;

          text += '; width: 0.5; align: center; color: black';

          return text;
        };
        // let thrustStartHandler = function () {
        let thrustStartHandler = () => {
          let thrustSound = this.data.thrustSound;
          thrustSound.stopSound();
          // this.sound.pool.children[0].setVolume(1.0);
          // factory.volume = {vol: 1.0}; //need to do this every time
          let initVol = thrustSound.data.volume;
          this.volume = { vol: initVol }; //need to do this every time
          if (thrustSound.pool.children[0]) {
            thrustSound.pool.children[0].setVolume(initVol);
            // console.log(`onClick: volume=${this.thrustSound.pool.children[0].getVolume()}`);
          }
          thrustSound.currentTime = 0.0;
          if (this.tween) {
            this.tween.stop();
          }
          thrustSound.playSound();
        };
        //tween compatible thrust handlers
        el.addEventListener('thrust-start', thrustStartHandler);
        el.addEventListener('thrust-stop', () => {
          let sound = this.data.thrustSound;

          this.tween = new TWEEN.Tween(this.volume);
          // this.tween.easing(TWEEN.Easing.Sinusoidal.In);
          this.tween.to(
            { vol: 0.0 }
            , 500);
          this.tween.onUpdate(function (obj) {
            // console.log(`onUpdate: this.vol=${this.vol}`);
            if (sound.pool.children[0]) {
            sound.pool.children[0].setVolume(this.vol);
            }
            // console.log(`onUpdate: pool.children[0].getVolume=${sound.pool.children[0].getVolume()}`);
          });
          this.tween.onComplete(function () {
            sound.stopSound();
          });

          this.tween.start();
        });
        el.addEventListener('sound-ended', ()=> {
          this.data.fireSoundStopCount++;
          // console.log(`fireSoundStartCount=${this.data.fireSoundStartCount}, fireSoundStopCount=${this.data.fireSoundStopCount}`);
        });
        el.addEventListener('sound-loaded', ()=> {console.log('sound loaded')});

        el.addEventListener('buttondown', function (e) {
          // console.log(`angParentComponent.asteroidsGameControllerListenerService.AFRAME.init: buttondown event: e=${e}`);
        });
        /*
        el.addEventListener('trackpaddown', function (e) {
          // console.log(`angParentComponent.asteroidsGameControllerListenerService.AFRAME.init: buttondown event: e=${e}`);
          // console.log(`trackpaddown: axis.x=${y}`);
          // console.log(`trackpaddown: axis.y=${e.target.components['tracked-controls'].axis[1]}`);
          let trkPadX =  e.target.components['tracked-controls'].axis[0];
          let trkPadY =  e.target.components['tracked-controls'].axis[1];
          // console.log(`trkPadX=${trkPadX}, trkPadY=${trkPadY}`);

          if (trkPadY >= 0) {
            console.log(`trackpaddown: upper half pressed`);
          }
          else  {
            console.log(`trackpaddown: lower half pressed`);
          }
          // debugger;
          // console.log(`trackpaddown: e.detail.target.object3D.position.x=${e.detail.target.object3D.position.x}`);
          // console.log(`trackpaddown: e.detail.target.object3D.position.y=${e.detail.target.object3D.position.y}`);
          // angParentComponent.asteroidsGame.shipFiredBullet();
        });
        */
        // el.addEventListener('trackpadchanged', function (e) {
        //   console.log(`trackpadchanged detected: e.detail.value=${e.detail.value}`);
        //   // debugger;
        // });
        el.addEventListener('gripdown', (e) => {
          // el.emit('fire-bullet');
          this.projEl.emit('fire-bullet');
          this.data.fireSoundStartCount++;
          // angParentComponent.asteroidsGame.shipFiredBullet();
          angParentComponent.asteroidsGame.shipFiredBullet();
        });
        el.addEventListener('touchstart',  (e) => {
          // console.log(`angParentComponent.asteroidsGameControllerListenerService.AFRAME.touchstart: ship.theta=${angParentComponent.asteroidsGame.ship.theta}`);
          angParentComponent.touchOn = true;
        });
        el.addEventListener('touchend', (e) => {
          // console.log(`angParentComponent.asteroidsGameControllerListenerService.AFRAME.touchend: ship.theta=${angParentComponent.asteroidsGame.ship.theta}`);
          angParentComponent.touchOn = false;
        });
        el.addEventListener('axismove', (e) => {
          var horizAxis = e.detail.axis[0];
          var upAxis = e.detail.axis[1];
          // debugger;
          // console.log(`axisMove: ctrlType=${angParentComponent.utils.getControllerType(this.el)}`);
          let ctrlType = this.data.controllerType || angParentComponent.utils.getControllerType(this.el);
          // console.log(`axisMove: ctrlType-2=${ctrlType}`);
          if (ctrlType === 'vive') {
          // console.log(`new axismove: horizAxis=${horizAxis}, upAxis=${upAxis}`);

          // if ((upAxis > 0 && horizAxis < 0) || (upAxis > 0 && horizAxis)) {
          // simulate being near touch pad "poles" by testing for relative ratio
          // between x and y.  Top = rotate CW, bottom = rotate CCW.
          // right = rotate CW, left = rotate CCW.
          // let upRatio = horizAxis === 0 ? 9999 : Math.abs(upAxis) / Math.abs(horizAxis);
          // let horizRatio = upAxis === 0 ? 9999 : Math.abs(horizAxis) / Math.abs(upAxis);
          // console.log(`asixmove: upRatio=${upRatio}, horizRatio=${horizRatio}`);
          let ratioFactor = 2.0;
          if( Math.abs(upAxis) > ratioFactor * Math.abs(horizAxis)) {
            if (upAxis > 0 ) {
              angParentComponent.asteroidsGame.ship.theta += this.data.shipRotFactor * base.ONE_DEG * (angParentComponent.asteroidsGame.shipRotFactor - 1);
            }
            else {
              angParentComponent.asteroidsGame.ship.theta -= this.data.shipRotFactor * base.ONE_DEG * (angParentComponent.asteroidsGame.shipRotFactor - 1);
            }
          }
          else if ( Math.abs(horizAxis) > ratioFactor * Math.abs(upAxis)) {
            if (horizAxis > 0 ) {
              angParentComponent.asteroidsGame.ship.theta += this.data.shipRotFactor * base.ONE_DEG * (angParentComponent.asteroidsGame.shipRotFactor - 1);
            }
            else {
              angParentComponent.asteroidsGame.ship.theta -= this.data.shipRotFactor * base.ONE_DEG * (angParentComponent.asteroidsGame.shipRotFactor - 1);
            }

          }
          // if ((upAxis > 0 && horizAxis < 0) || (upAxis > 0 && horizAxis)) {
          // }
          // else {
          // }
        }
        else {
          // console.log(`axisMove: now in oculus path`);
          if (angParentComponent.touchOn) {
            var horizAxis = e.detail.axis[0];
            var upAxis = e.detail.axis[1];
            var theta = -Math.atan2(e.detail.axis[0], e.detail.axis[1]);
            // round to tenths to reduce sensitivity
            theta = Number(theta.toFixed(1));
            // console.log(`Listener: this.shipRotFactor=${this.data.shipRotFactor}`);


            if (theta > 0) {
              angParentComponent.asteroidsGame.ship.theta -= this.data.shipRotFactor * base.ONE_DEG * (angParentComponent.asteroidsGame.shipRotFactor - 1);
            }
            else if (theta < 0) {
              angParentComponent.asteroidsGame.ship.theta += this.data.shipRotFactor * base.ONE_DEG * (angParentComponent.asteroidsGame.shipRotFactor - 1);
            }
          }
        }
        });
        /*
        // this is the old "touchpad twist" method which is done by dragging your
        // finger along touchpad to essentially create an absolute rotation in
        // correpsondence with relative ange on the touchpad.
        el.addEventListener('axismove', (e) => {
          // console.log(`angParentComponent.asteroidsGameControllerListenerService.AFRAME.init: axismove event: e=${e}`);
          if (angParentComponent.touchOn) {
            var horizAxis = e.detail.axis[0];
            var upAxis = e.detail.axis[1];
            var theta = -Math.atan2(e.detail.axis[0], e.detail.axis[1]);
            // round to tenths to reduce sensitivity
            theta = Number(theta.toFixed(1));
            // console.log(`Listener: this.shipRotFactor=${this.data.shipRotFactor}`);


            if (theta > 0) {
              angParentComponent.asteroidsGame.ship.theta -= this.data.shipRotFactor * base.ONE_DEG * (angParentComponent.asteroidsGame.shipRotFactor - 1);
            }
            else if (theta < 0) {
              angParentComponent.asteroidsGame.ship.theta += this.data.shipRotFactor * base.ONE_DEG * (angParentComponent.asteroidsGame.shipRotFactor - 1);
            }
          }
        });
        */
        el.addEventListener('triggerdown', function (e) {
          // console.log(`AGCLS: now emitting thrust-start`);
          angParentComponent.thrusterEngaged = true;
          el.emit('thrust-start');
        });
        el.addEventListener('triggerup', (e) => { //Vive
          angParentComponent.thrusterEngaged = false;
          // console.log(`AGCLS: now emitting thrust-stop`);

          el.emit('thrust-stop');
        });

        el.addEventListener('scoreChange', (e, obj) => {
          // console.log(`AGCLS: now in scoreChange handler, score=${e.detail.score}`);

          // debugger;
          let rhInfoPane = document.querySelector('#right-hand-info-pane') as AFrame.Entity;

          if( rhInfoPane) {
            rhInfoPane.setAttribute('text', formatInfoText(e.detail));
          }
        });

        el.addEventListener('abuttondown', (e) => {
          let rhInfoPane = document.querySelector('#right-hand-info-pane');

          if(!rhInfoPane) {
            let infoPane = document.createElement('a-plane');
            infoPane.setAttribute('width', '0.25');
            infoPane.setAttribute('height', '0.15');
            infoPane.setAttribute('position', '-0.15 -0.05 -0.1');
            infoPane.setAttribute('material', 'side: double; opacity: 0.6');
            infoPane.setAttribute('rotation', '0 0 90');
            // infoPane.setAttribute('text', this.formatInfoText(angParentComponent.angParentComponent.asteroidsGame.gameState));
            infoPane.setAttribute('text', formatInfoText(angParentComponent.asteroidsGame.gameState));
              // `value: score: ${angParentComponent.angParentComponent.asteroidsGame.score}; width : 1; align: center`);
            infoPane.setAttribute('id', 'right-hand-info-pane');
            e.target.appendChild(infoPane);
          }
          else {
            // debugger;
            e.target.removeChild(rhInfoPane);
          }
        });
        el.addEventListener('bbuttondown', (e) => {
          // console.log(`abuttondown event`);
          let homeEl : any = document.querySelector('#home-link');
          // console.log(`abuttondown.style.visibility=${homeEl.style.visibility}`);

          let rhcEntity = angParentComponent.utils.getHandControlEntity('right');
          // toggle visiblity
          if (homeEl.getAttribute('visible')) {
            homeEl.setAttribute('visible', false);
            (document.querySelector('.proj-scene') as AFrame.Entity).emit('unPauseGame');
            angParentComponent.asteroidsGame.gamePaused = false;

            // remove laser pointer
            rhcEntity.removeAttribute('controller-cursor');

            // and restore background sound
            //vt-x this.data.bgSound.play();
            // and thrust listener
            el.addEventListener('thrust-start', thrustStartHandler);
          }
          else {
            // pause the game
            (document.querySelector('.proj-scene') as AFrame.Entity).emit('pauseGame');
            angParentComponent.asteroidsGame.gamePaused = true;
            //vt-xthis.data.bgSound.pause();
            // temporarily turn of thrust-start, so when they select an object with the
            // cursor we don't get a thruster blast.
            el.removeEventListener('thrust-start', thrustStartHandler);

            let dollyEl: any = document.querySelector('#dolly');
            let projEl : any = document.querySelector('.proj-obj');
            let projElPos = projEl.getAttribute('position');
            // sync object3D state to wrapper attribute state
            dollyEl.setAttribute("position", dollyEl.object3D.position);

            // getHUDPlacement alt
            let hudRot = angParentComponent.utils.getHUDPlacement();
            let hudPos = hudRot.clone();
            hudPos.multiplyScalar(7);

            homeEl.setAttribute('rotation', hudRot);
            homeEl.setAttribute('position', hudPos);
            homeEl.object3D.lookAt(hudRot);
            // end getHUDPlacement
            homeEl.setAttribute('visible', true);

            // add a "laser pointer" to the right hand controller.
            let ctrlCursorAttr = document.createAttribute("controller-cursor");
            // ctrlCursorAttr.value = "democlass";
            rhcEntity.setAttributeNode(ctrlCursorAttr);
          }
          // and finally update the info pane if active
          let rhInfoPane = document.querySelector('#right-hand-info-pane') as AFrame.Entity;
          if (rhInfoPane) {
            rhInfoPane.setAttribute('text', formatInfoText(angParentComponent.asteroidsGame.gameState));
          }
        })
      },
      tick: function () {
        if (angParentComponent.thrusterEngaged) {
          // I don't know why I have to add 90 deg, but I do as empirically determined
          angParentComponent.asteroidsGame.ship.vx += angParentComponent.asteroidsGame.ship.deltaVx * Math.cos(angParentComponent.asteroidsGame.ship.theta + Math.PI / 2.0) * 0.2 * this.shipDeltaFactor;

          angParentComponent.asteroidsGame.ship.vy += angParentComponent.asteroidsGame.ship.deltaVy * Math.sin(angParentComponent.asteroidsGame.ship.theta + Math.PI / 2.0) * 0.2 * this.shipDeltaFactor;

          // and emit an event for any observers who may need to respond to this
          // this.shipMove.emit(null);
        }
        TWEEN.update();
      }
    })
  // }
    // console.log(`agcl: post: component=${AFRAME.components['asteroids-game-controller-listener']}`);
  }

}
