// import { Injectable, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { BaseService } from '../../services/base.service';

@Injectable()
// export class ShipThrustSoundService implements OnInit{
export class ShipThrustSoundService{

  aframeComp : any;

  constructor(
    private utils: UtilsService,
    private base: BaseService
  ) {
    console.log(`ShipThrustSoundService.ctor: entered`);
    this.registerAFrameComponent();
    // debugger;
   }

  // ngOnInit() {
  //   console.log(`ShipThrustSoundService.ngOnInit: entered`);
    
  //   this.registerAFrameComponent();
  // }

  registerAFrameComponent() {
    let angContext = this;
    console.log(`ShipThrustSound.registerAframeComponent: utils.doNothing=${this.utils.doNothing()}`);
    

    this.aframeComp= AFRAME.registerComponent('ship-thrust-sound', {
      schema: {
        rampTime: {type: 'int', default: 1000},
        targetVolume: {type: 'number', default: 0},
        tickInterval: {type: 'int', default: 50}
      },
      init: function () {
        // debugger;
        console.log(`ShipThrustSoundService.aframe.init: entered`);
        angContext.base.docLSS['ship-thrust-reset'] = false;

        //TODO make this the parent element not the 'asteroids-game-controller-listener' specific element
        // debugger;
        let asteroidsController : any = document.querySelector('[asteroids-game-controller-listener]');
        // this.el.addEventListener('thrust-stop', () => {
        asteroidsController.addEventListener('thrust-stop', () => {
          console.log(`ShipThrustSoundService.thrust-stop: about to stop sound`);
          
          this.el.components.sound.stopSound();
          // angContext.utils.fadeOut(this.el.components.sound, 1000, 0.0, 25);
        })

        // this.el.addEventListener('thrust-start', () => {
        asteroidsController.addEventListener('thrust-start', () => {
          console.log(`ShipThrustSoundService.thrust-start: about to start sound`);
          this.el.components.sound.currentTime = 0;
          this.el.components.sound.playSound();
          console.log(`ShipThrustSound.addEventListener: angContext.utils.doNothing=${angContext.utils.doNothing()}`);
        })
      },
      fadeOut: function () {
        console.log(`fadeOut: entered, rampTime=${this.data.rampTime}`);
        console.log(`fadeOut: entered, tickInterval=${this.data.tickInterval}`);
      }
    })
    // debugger;
  }

}
