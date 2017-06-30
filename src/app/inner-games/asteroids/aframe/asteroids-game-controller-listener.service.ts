import { Injectable } from '@angular/core';
import { AsteroidsGame } from '../asteroids-game'
import { BaseService } from '../../../services/base.service';

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
      // init: () => {
      // schema: {
      //   touchOn : { default :false},
      // },
      init: function () {
        console.log(`AsteroidsGameControllerListenerService.AFRAME.init: entered`);
        var el = this.el;
        // el.addEventListener('buttondown', function (e) {
        el.addEventListener('trackpaddown', function (e) {
          console.log(`AsteroidsGameControllerListenerService.AFRAME.init: buttondown event: e=${e}`);
          asteroidsGame.shipFiredBullet();
        });
        el.addEventListener('gripdown', function (e) {
          console.log(`AsteroidsGameControllerListenerService.AFRAME.init: buttondown event: e=${e}`);
          asteroidsGame.shipFiredBullet();
        });
        // el.addEventListener('touchstart', function (e) {
        //   console.log(`AsteroidsGameControllerListenerService.AFRAME.init: touchstart event: e=${e}`);
        //   console.log(`AsteroidsGameControllerListenerService.AFRAME.touchstart: e.value=${e.detail.state.value}`);
        //   // asteroidsGame.shipFiredBullet();
        // });
        // el.addEventListener('touchstart', function (e) {
        el.addEventListener('touchstart',  (e) => {
          console.log(`AsteroidsGameControllerListenerService.AFRAME.touchstart: ship.theta=${asteroidsGame.ship.theta}`);
          // this.data.touchOn = true;
          angParentComponent.touchOn = true;
          // asteroidsGame.shipFiredBullet();
        });
        // el.addEventListener('touchend', function (e) {
        el.addEventListener('touchend', (e) => {
          console.log(`AsteroidsGameControllerListenerService.AFRAME.touchend: ship.theta=${asteroidsGame.ship.theta}`);
          // this.data.touchOn = false;
          angParentComponent.touchOn = false;
          // asteroidsGame.shipFiredBullet();
        });
        // el.addEventListener('buttonchanged', function (e) {
        //   console.log(`AsteroidsGameControllerListenerService.AFRAME.init: buttonchanged event: e=${e}`);
        //   console.log(`AsteroidsGameControllerListenerService.AFRAME.buttonchanged: e.value=${e.detail.state.value}`);
        // });
        // el.addEventListener('axismove', function (e) {
        el.addEventListener('axismove', (e) => {
          console.log(`AsteroidsGameControllerListenerService.AFRAME.init: axismove event: e=${e}`);
          // if (e.detail.changed[0] || e.detail.changed[1]) {
          // if (this.data.touchOn) {
          if (angParentComponent.touchOn) {
            var theta = -Math.atan2(e.detail.axis[0], e.detail.axis[1]);
            // round to tenths to reduce sensitivity
            // theta /= 1000000;
            // theta *= 1000000;
            // theta = parseInt(theta.toFixed(12));
            // theta = parseInt(theta.toPrecision(5));
            // theta = Number(theta.toPrecision(3));
            theta = Number(theta.toFixed(1));
            // asteroidsGame.ship.theta = theta;
            if (theta > angParentComponent.lastTouchPadTheta) {
              asteroidsGame.ship.theta += base.ONE_DEG * asteroidsGame.shipRotFactor;
            }
            else if (theta < angParentComponent.lastTouchPadTheta) {
              asteroidsGame.ship.theta -= base.ONE_DEG * asteroidsGame.shipRotFactor;
            }
            angParentComponent.lastTouchPadTheta = theta;
          }
          // console.log(`AsteroidsGameControllerListenerService.AFRAME.buttonchanged: e.value=${e.detail.state.value}`);
        });
        // el.addEventListener('triggerdown', function (e) {
        el.addEventListener('triggerdown', (e) => {
          console.log(`AsteroidsGameControllerListenerService.AFRAME.init: triggerdown event: e=${e}`);
          angParentComponent.thrusterEngaged = true;
          // asteroidsGame.ship.vx += asteroidsGame.ship.deltaVx * Math.cos(asteroidsGame.ship.theta);
          // asteroidsGame.ship.mesh.translateX(asteroidsGame.ship.vx);

          // asteroidsGame.ship.vy += asteroidsGame.ship.deltaVy * Math.sin(asteroidsGame.ship.theta);
          // asteroidsGame.ship.mesh.translateY(asteroidsGame.ship.vy);
        });
        el.addEventListener('triggerup', (e) => {
          angParentComponent.thrusterEngaged = false;
        });
        // el.addEventListener('gripdown', function (e) {
        //   console.log(`AsteroidsGameControllerListenerService.AFRAME.init: gripdown event: e=${e}`);
        // });
      },
      tick: () => {
        if (angParentComponent.thrusterEngaged) {
          asteroidsGame.ship.vx += asteroidsGame.ship.deltaVx * Math.cos(asteroidsGame.ship.theta) * 0.2;
          // asteroidsGame.ship.mesh.translateX(asteroidsGame.ship.vx);

          asteroidsGame.ship.vy += asteroidsGame.ship.deltaVy * Math.sin(asteroidsGame.ship.theta) * 0.2;
          // asteroidsGame.ship.mesh.translateY(asteroidsGame.ship.vy);
        }
        // asteroidsGame.ship.vx += asteroidsGame.ship.deltaVx * Math.cos(asteroidsGame.ship.theta) * 0.01;
        // asteroidsGame.ship.mesh.translateX(asteroidsGame.ship.vx);

        // asteroidsGame.ship.vy += asteroidsGame.ship.deltaVy * Math.sin(asteroidsGame.ship.theta) * 0.01;
        // asteroidsGame.ship.mesh.translateY(asteroidsGame.ship.vy);
      }
    })
  }

}
