import { Injectable } from '@angular/core';
import { AsteroidsGame } from '../asteroids-game'

@Injectable()
export class AsteroidsGameControllerListenerService {

  constructor(asteroidsGame: AsteroidsGame) {
    let touchOn : boolean;

    AFRAME.registerComponent('asteroids-game-controller-listener', {
      // init: () => {
      // schema: {
      //   touchOn : { default :false},
      // },
      init: function () {
        console.log(`AsteroidsGameControllerListenerService.AFRAME.init: entered`);
        var el = this.el;
        el.addEventListener('buttondown', function (e) {
          console.log(`AsteroidsGameControllerListenerService.AFRAME.init: buttondown event: e=${e}`);
          asteroidsGame.shipFiredBullet();
        });
        // el.addEventListener('touchstart', function (e) {
        //   console.log(`AsteroidsGameControllerListenerService.AFRAME.init: touchstart event: e=${e}`);
        //   console.log(`AsteroidsGameControllerListenerService.AFRAME.touchstart: e.value=${e.detail.state.value}`);
        //   // asteroidsGame.shipFiredBullet();
        // });
        el.addEventListener('touchstart', function (e) {
          console.log(`AsteroidsGameControllerListenerService.AFRAME.touchstart: ship.theta=${asteroidsGame.ship.theta}`);
          // this.data.touchOn = true;
          touchOn = true;
          // asteroidsGame.shipFiredBullet();
        });
        el.addEventListener('touchend', function (e) {
          console.log(`AsteroidsGameControllerListenerService.AFRAME.touchend: ship.theta=${asteroidsGame.ship.theta}`);
          // this.data.touchOn = false;
          touchOn = false;
          // asteroidsGame.shipFiredBullet();
        });
        // el.addEventListener('buttonchanged', function (e) {
        //   console.log(`AsteroidsGameControllerListenerService.AFRAME.init: buttonchanged event: e=${e}`);
        //   console.log(`AsteroidsGameControllerListenerService.AFRAME.buttonchanged: e.value=${e.detail.state.value}`);
        // });
        el.addEventListener('axismove', function (e) {
          console.log(`AsteroidsGameControllerListenerService.AFRAME.init: axismove event: e=${e}`);
          // if (e.detail.changed[0] || e.detail.changed[1]) {
          // if (this.data.touchOn) {
          if (touchOn) {
            var theta = -Math.atan2(e.detail.axis[0], e.detail.axis[1]);
            asteroidsGame.ship.theta = theta;
          }
          // console.log(`AsteroidsGameControllerListenerService.AFRAME.buttonchanged: e.value=${e.detail.state.value}`);
        });
        el.addEventListener('triggerdown', function (e) {
          console.log(`AsteroidsGameControllerListenerService.AFRAME.init: triggerdown event: e=${e}`);
          asteroidsGame.ship.vx += asteroidsGame.ship.deltaVx * Math.cos(asteroidsGame.ship.theta);
          asteroidsGame.ship.mesh.translateX(asteroidsGame.ship.vx);

          asteroidsGame.ship.vy += asteroidsGame.ship.deltaVy * Math.sin(asteroidsGame.ship.theta);
          asteroidsGame.ship.mesh.translateY(asteroidsGame.ship.vy);
        });
        // el.addEventListener('gripdown', function (e) {
        //   console.log(`AsteroidsGameControllerListenerService.AFRAME.init: gripdown event: e=${e}`);
        // });
      }
    })
  }

}
