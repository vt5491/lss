///<reference path="../../../typings/index.d.ts" />

import { Component, OnInit, Injector, ViewChild, 
  ComponentFactoryResolver, ViewContainerRef, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AsteroidsGame } from '../inner-games/asteroids/asteroids-game';
import { LuxorSceneComponent} from './scenes/luxor-scene/luxor-scene.component';
import { PlaneSceneComponent} from './scenes/plane-scene/plane-scene.component';
import { Router } from '@angular/router';
// import * as dat from 'datGUIVR';
// import * as datGUIVR from 'datGUIVR';
declare var dat: any;

@Component({
  selector: 'app-loopy-surface-surfers',
  templateUrl: './loopy-surface-surfers.component.html',
  styleUrls: ['./loopy-surface-surfers.component.css'],
})
// @View({
//     // template: `<div #content></div>`,
//     directives: [LuxorSceneComponent]
// })
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
  yOffset: number;
  sceneSelected : boolean = false;
  asterhedraScenes : Array<Object> = [
    {title : 'Plane', id : 'plane-scene', pos : "0 0 0"},
    {title : 'Luxor', id : 'luxor-scene', pos : "0 -2 0"},
    {title : 'Pool Table', id : 'pool-hall-scene', pos : "0 -4 0"},
  ];
  // @ViewChild(GameSceneDirective) appGameScene: GameSceneDirective;
  @ViewChild('parent', {read: ViewContainerRef})
  parent: ViewContainerRef;
  @ViewChild('introScene') introScene: ElementRef;
  @ViewChild(LoopySurfaceSurfersComponent) lss : LoopySurfaceSurfersComponent;

  constructor(
    private innerGame : AsteroidsGame,
    private injector: Injector,
    private router: Router,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private cfr: ComponentFactoryResolver
  ) {
    let angParentComponent = this;
    
    this.yOffset = 2.5;
    this.billBoard['xOrigin'] = 0;
    this.billBoard['yOrigin'] = 1;
    this.billBoard['zOrigin'] = 0;
    let afComp = AFRAME.registerComponent('lss-aframe-component', {
      init: function() {
        angParentComponent.initSceneAng();

        var customizeBtn = document.querySelector('#customizeBtn');
        (customizeBtn as any).addEventListener('pressed', function (e) {
          let custDialogEl = document.querySelector('#custDialog');
          if (!custDialogEl) {
            var dialogEl = document.createElement('a-entity');
            dialogEl.setAttribute('geometry', 'primitive: plane');
            dialogEl.setAttribute('material', 'opacity: 0.5; side: double');
            dialogEl.setAttribute('id', 'custDialog');
            e.target.appendChild(dialogEl);
          }
          else {
            e.target.removeChild(custDialogEl);
          }
        });
      },
      tick:  (time, timeDelta) => {
      },
      pause: function () {
        console.log(`LoopySurfaceSurfers.lss-aframe-component.pause: entered`);
      },
      play: function () {
        console.log(`LoopySurfaceSurfers.lss-aframe-component.play: entered`);
      }
    });
  }

  ngOnInit() {
    console.log(`LoopySurfaceSurfers.ngOnInit: entered`);
  }

  // init the parts of the scene than cannot be done via a-frame html
  initSceneAng() {
    let sceneEl  = document.querySelector('a-scene') as AFrame.Entity;
    sceneEl.addEventListener('enter-vr', function () {
      let cameraEl = document.querySelector('#camera');
      (cameraEl as any).setAttribute('wasd-controls','inVrState','true')
    });
    sceneEl.addEventListener('exit-vr', function () {
      let cameraEl = document.querySelector('#camera');
      (cameraEl as any).setAttribute('wasd-controls','inVrState','false')
    });

    let sceneObj  = (sceneEl as AFrame.Entity).object3D;

    let list = document.querySelectorAll('.scene-select');

    Array.prototype.forEach.call(list, (item) => {
    }) ;

    // var boxEl = document.querySelector('#box');
    // var boxObj = document.querySelector('#box').object3D;
    // let boxObjParms = boxObj.children[0].geometry.metadata.parameters;
    // var gui = dat.GUIVR.create( 'boxObjParms' );
    let gui = dat.GUIVR.create();
    gui.position.set(0, 0, 0);
    let btnCtrl = gui.addButton( () => {console.log(`button pressed`);} );
    // planeEl.object3D.add( gui );
    sceneObj.add( gui );

    let rhc : any = document.querySelector('#ctrl-right');
    let guiInputRight = dat.GUIVR.addInputObject( rhc.object3D );
    rhc.addEventListener('triggerdown', function () {
      console.log(`rhc: now in triggerdown`);
      guiInputRight.pressed(true);
    });
    rhc.addEventListener('triggerup', function () {
      console.log(`rhc: now in triggerup`);
      guiInputRight.pressed(false);
    });

    sceneObj.add( guiInputRight );


    // let gui = window.dat.GUIVR.create();
    // debugger;

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
      let posData = this.ocRightController.el.components.position.data;
    });

    this.ocRightControllerElem.addEventListener('triggerdown',  (evt) => {
      this.triggerRightDown = true
      if ( this.gripRightDown) {
        this.moveCameraByGrip(this.ocRightControllerElem);
      }
    });

    this.ocRightControllerElem.addEventListener('triggerup',  (evt) => {
      this.triggerRightDown = false
    });

    this.ocRightControllerElem.addEventListener('gripdown',  (evt)  => {
      this.gripRightDown = true;
      if ( this.triggerRightDown) {
        this.moveCameraByGrip(this.ocRightControllerElem);
      }
    });

    this.ocRightControllerElem.addEventListener('gripup',  (evt)  => {
      this.gripRightDown = false;
    });
  }

  moveCameraByGrip(el : Element) {
    let dollyEl = document.querySelector('#dolly') as AFrame.Entity;
    let dollyObj = dollyEl.object3D;

    let controllerEl = document.querySelector('#oc-control-right');
    let controllerObj = (controllerEl as AFrame.Entity).object3D;

    dollyObj.position.x = controllerObj.position.x;
    dollyObj.position.y = controllerObj.position.y;
    dollyObj.position.z = controllerObj.position.z;
  }

  sceneSelectMouseEnter(evt) {
    evt.target.setAttribute('color', 'blue');
  }

  sceneSelectMouseLeave(evt) {
    evt.target.setAttribute('color', '#CCC');
  }

  actionButtonClick(e : Event) {
    (e.target as any).id='luxor';
    this.sceneSelectClick(e);
  }
  sceneSelectClick2(e : Event) {
    if(this.sceneSelected) return;
    this.sceneSelected = true;
  }

  sceneSelectClick(evt) {
    if(this.sceneSelected) return;
    this.sceneSelected = true;

    switch(true) {
      case /plane/.test(evt.target.id):
        let componentFactory = this._componentFactoryResolver.resolveComponentFactory(PlaneSceneComponent);
        let componentRef = this.viewContainerRef.createComponent(componentFactory);
        (document.querySelectorAll('a-scene')[1] as any).enterVR()
        
        break;

      case /luxor/.test(evt.target.id):
        let cameraEl = document.querySelector('#camera');
        (cameraEl as any).setAttribute('wasd-controls', 'inVrState', 'false')
        var el = document.querySelector('#intro-scene');
        (el as any).sceneEl.exitVR();
        el.parentNode.removeChild(el);
        // and xfer to new url
        this.router.navigateByUrl('/luxorScene', { });
        break;

      case /pool-hall/.test(evt.target.id):
        debugger;
        (document.querySelector('a-link') as any).navigate('//192.168.50.68:4200/poolHallScene');
        break;
    }
  }
  getBillBoardY() : number {
    console.log(`now in getBillBoardY`);
    return this.billBoard['y'];
  }

  getBillBoardZ() : number {
    return this.billBoard['z'];
  }

  doSomething() : number {
    return 7;
  }


}
