///<reference path="../../../typings/index.d.ts" />

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loopy-surface-surfers',
  templateUrl: './loopy-surface-surfers.component.html',
  styleUrls: ['./loopy-surface-surfers.component.css']
})
export class LoopySurfaceSurfersComponent implements OnInit {
  camera : THREE.Camera;
  ocLeftController : AFrame.Component;
  ocLeftControllerElem : Element;
  ocRightController : AFrame.Component;
  ocRightControllerElem : Element;
  billBoard : Object = {};
  title : string = "hello";
  pos_1 : string = "1 1 1";
  triggerLeftDown: boolean = false;
  triggerRightDown: boolean = false;
  gripLeftDown: boolean = false;
  gripRightDown: boolean = false;

  constructor() {
    this.billBoard['xOrigin'] = 0;
    this.billBoard['yOrigin'] = 1;
    this.billBoard['zOrigin'] = 0;
    AFRAME.registerComponent('lss-aframe-component', {
      init: () => {
        this.initSceneAng();
      },
      tick:  (time, timeDelta) => {
        let posData = this.ocLeftController.el.components.position.data;
        // console.log(`LoopySurfaceSurfers.tick: oc-posData.x=${posData.x}, y=${posData.y}, z=${posData.z}`);
      }
    });
  }

  ngOnInit() {
    console.log(`LoopySurfaceSurfers.ngOnInit: entered`);
    // var sceneEl = document.querySelector('a-scene') as AFrame.Entity;
    // if (sceneEl.hasLoaded) {
    //   // run(aFrameHiWorld);
    //   initSceneAng();
    // } else {
    //   sceneEl.addEventListener('loaded', initSceneAng);
    // }
    // function run (aFrameHiWorld) {
    //   aFrameHiWorld.init();
    //   aFrameHiWorld.animation();
    //   // aFrameHiWorld.update();
    //   // var entity = scene.querySelector('a-entity');
    //   // entity.setAttribute('material', 'color', 'red');
    // }
    //
    // this.initSceneAng();
  }

  // init the parts of the scene than cannot be done via a-frame html
  initSceneAng() {
    // let sceneEl : AFrame.Entity  = document.querySelector('a-scene') as AFrame.Entity;
    let sceneEl  = document.querySelector('a-scene') as AFrame.Entity;
    sceneEl.addEventListener('enter-vr', function () {
      console.log("ENTERED VR");
      // let cameraEl = document.querySelector('[wasd-controls]');
      let cameraEl = document.querySelector('#camera');
      (cameraEl as any).setAttribute('wasd-controls','inVrState','true')
      // let wasdEl = cameraEl.getAttribute('wasd-controls');
      // // let wasdEl = (cameraEl.getAttribute('wasd-controls') as AFrame.Component);
      // (wasdEl as any).setAttribute('inVrState', 'true');
    });
    sceneEl.addEventListener('exit-vr', function () {
      console.log("Exited VR");
      let cameraEl = document.querySelector('#camera');
      (cameraEl as any).setAttribute('wasd-controls','inVrState','false')
    });

    // debugger;
    // let sceneObj : THREE.Object3D = (sceneEl as AFrame.Entity).object3D();
    let sceneObj  = (sceneEl as AFrame.Entity).object3D;

    let axisHelper = new THREE.AxisHelper(1);
    sceneObj.add(axisHelper);

    // let planeTextEl  = document.querySelector('#plane-text') as AFrame.Entity;
    // let planeTextObj = planeTextEl.object3D;
    // // debugger;
    // planeTextObj.position.x = 1;
    // planeTextObj.position.y = 0;
    // planeTextObj.position.z = 0;
    let billBoardEl = document.querySelector('#bill-board') as AFrame.Entity;
    let billBoardObj = billBoardEl.object3D;

    billBoardObj.position.x += this.billBoard['xOrigin'];
    billBoardObj.position.y += this.billBoard['yOrigin'];
    billBoardObj.position.z += this.billBoard['zOrigin'];

    this.initControllers();
  }

  initControllers = () => {
    this.ocLeftControllerElem = document.querySelector('#oc-control-left');

    this.ocLeftController = (this.ocLeftControllerElem as any).components['oculus-touch-controls'];

    this.ocLeftControllerElem.addEventListener('triggerdown',  (evt) => {
      console.log('trigger pressed');
      let posData = this.ocLeftController.el.components.position.data;
      console.log(`x=${posData.x * 100}, y=${posData.y * 100}, z=${posData.z * 100}`);
      this.triggerLeftDown = true
    });

    this.ocLeftControllerElem.addEventListener('triggerup',  (evt) => {
      console.log('trigger released');
      this.triggerLeftDown = false
    });

    this.ocRightControllerElem = document.querySelector('#oc-control-right');

    this.ocRightController = (this.ocRightControllerElem as any).components['oculus-touch-controls'];

    this.ocRightControllerElem.addEventListener('abuttondown',  (evt)  => {
      console.log('a button pressed');
      let posData = this.ocRightController.el.components.position.data;
      console.log(`x=${posData.x * 100}, y=${posData.y * 100}, z=${posData.z * 100}`);
    });

    this.ocRightControllerElem.addEventListener('triggerdown',  (evt) => {
      console.log('trigger pressed');
      this.triggerRightDown = true
      if ( this.gripRightDown) {
        console.log(`right hand squeezed - grip-trigger`);
      }
    });

    this.ocRightControllerElem.addEventListener('triggerup',  (evt) => {
      console.log('trigger released');
      this.triggerRightDown = false
    });

    this.ocRightControllerElem.addEventListener('gripdown',  (evt)  => {
      console.log('right grip is down');
      this.gripRightDown = true;
      if ( this.triggerRightDown) {
        console.log(`right hand squeezed - trigger-grip`);
      }
    });

    this.ocRightControllerElem.addEventListener('gripup',  (evt)  => {
      console.log('right grip is up');
      this.gripRightDown = false;
    });
  }

  getBillBoardY() : number {
    console.log(`now in getBillBoardY`);
    return this.billBoard['y'];
  }

  getBillBoardZ() : number {
    return this.billBoard['z'];
  }


}
