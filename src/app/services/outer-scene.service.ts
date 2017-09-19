//Created: 2017-08-23
//
// Note: this is really just a supporting service for the scene level components
// e.g plane-scene.service.  In other words, this doesn't drive the scene, but
// rather the scene drives this.  The main objective of this service is to store
// all the scene independent state and methods, so you don't have to define things
// multiple time for each scene.  The best example of a scene independent object
// is the dolly/cammera.

import { Injectable } from '@angular/core';

@Injectable()
export class OuterSceneService {
  dolly : THREE.Object3D; 
  projObj : THREE.Object3D;
  projScene : THREE.Object3D;
  discreteInnerSceneScroll : Boolean;
  // discreteInnerSceneScrollQuanta: Number;
  trackDolly : Boolean;

  constructor() { 
    this.discreteInnerSceneScroll = false;
    this.trackDolly = true;
  }

  // init is for things that are not available when the ctor runs e.g certain dom entities
  // that need to be driven by clients of this service on 'ngOnInit' events.
  init() {
    let dollyEl = document.querySelector('#dolly') as AFrame.Entity;
    this.dolly = dollyEl.object3D;
    console.log("OuterGameService.init: this.dolly=${this.dolly}");
    let projObjEl = document.querySelector('.proj-obj') as AFrame.Entity;
    this.projObj = projObjEl.object3D;
    let projSceneEl = document.querySelector('.proj-scene') as AFrame.Entity;
    this.projScene = projSceneEl.object3D;

    let axisHelper = new THREE.AxisHelper(1);
    this.projScene.add(axisHelper);
    this.projScene.getObjectByProperty('type', 'LineSegments').position.x = -5;
    // (document as any).LSS = new Object();
    // This is a global stash for transferring state among disparate components.
    (document as any).LSS = {};
  }

  onInnerSceneTick( e: Event)  {
    console.log('OuterGameService.onInnerSceneTick: hello');
  }

  // trackDolly (pos : THREE.Vector3 ) {

  // }
}

