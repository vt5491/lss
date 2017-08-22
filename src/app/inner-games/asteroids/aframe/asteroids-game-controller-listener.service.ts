import { Injectable } from '@angular/core';
import { AsteroidsGame } from '../asteroids-game'
import { BaseService } from '../../../services/base.service';

//Vive original: gripdown -> fire bullet
//             : triggerdown -> thrust 

@Injectable()
export class AsteroidsGameControllerListenerService {
  public touchOn : boolean;
  public thrusterEngaged : boolean;
  public lastTouchPadTheta : number;

  constructor(asteroidsGame: AsteroidsGame, base: BaseService) {
    let angParentComponent = this;
    // let touchOn : boolean;
    // let thrusterEngaged: boolean;

    AFRAME.registerComponent('asteroids-game-controller-listener', {
      init: function () {
        console.log(`AsteroidsGameControllerListenerService.AFRAME.init: entered`);
        var el = this.el;
        el.addEventListener('buttondown', function (e) {
          console.log(`AsteroidsGameControllerListenerService.AFRAME.init: buttondown event: e=${e}`);
        });
        el.addEventListener('trackpaddown', function (e) {
          console.log(`AsteroidsGameControllerListenerService.AFRAME.init: buttondown event: e=${e}`);
          asteroidsGame.shipFiredBullet();
        });
        el.addEventListener('gripdown', function (e) { //Vive
          console.log(`AsteroidsGameControllerListenerService.AFRAME.init: buttondown event: e=${e}`);
          asteroidsGame.shipFiredBullet();
        });
        el.addEventListener('touchstart',  (e) => {
          console.log(`AsteroidsGameControllerListenerService.AFRAME.touchstart: ship.theta=${asteroidsGame.ship.theta}`);
          angParentComponent.touchOn = true;
        });
        el.addEventListener('touchend', (e) => {
          console.log(`AsteroidsGameControllerListenerService.AFRAME.touchend: ship.theta=${asteroidsGame.ship.theta}`);
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

            if (theta > 0) {
              asteroidsGame.ship.theta -= base.ONE_DEG * (asteroidsGame.shipRotFactor - 1);
            }
            else if (theta < 0) {
              asteroidsGame.ship.theta += base.ONE_DEG * (asteroidsGame.shipRotFactor - 1);
            }
          }
        });
        el.addEventListener('triggerdown', function (e) {
        // el.addEventListener('triggerdown', (e) => { // Vive
        // el.addEventListener('gripdown', (e) => {
          console.log(`AsteroidsGameControllerListenerService.AFRAME.init: triggerdown event: e=${e}`);
          angParentComponent.thrusterEngaged = true;
        });
        el.addEventListener('triggerup', (e) => { //Vive
          angParentComponent.thrusterEngaged = false;
        });
      },
      tick: () => {
        if (angParentComponent.thrusterEngaged) {
          asteroidsGame.ship.vx += asteroidsGame.ship.deltaVx * Math.cos(asteroidsGame.ship.theta) * 0.2;

          asteroidsGame.ship.vy += asteroidsGame.ship.deltaVy * Math.sin(asteroidsGame.ship.theta) * 0.2;
        }
      }
    })
  }

}
