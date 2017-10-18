///<reference path="../../../typings/index.d.ts" />

import { Component, OnInit, Injector, ViewChild, 
  ComponentFactoryResolver, ViewContainerRef, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AsteroidsGame } from '../inner-games/asteroids/asteroids-game';
import { LuxorSceneComponent} from './scenes/luxor-scene/luxor-scene.component';
import { PlaneSceneComponent} from './scenes/plane-scene/plane-scene.component';
import { Router } from '@angular/router';
// import { GameSceneDirective } from '../directives/game-scene.directive';


@Component({
  selector: 'app-loopy-surface-surfers',
  templateUrl: './loopy-surface-surfers.component.html',
  styleUrls: ['./loopy-surface-surfers.component.css'],
  // schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
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
  // ocRightControllerElem : AFrame.Entity;
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
    // private planeScene : PlaneSceneComponent
    private viewContainerRef: ViewContainerRef,
    private cfr: ComponentFactoryResolver
  ) {
    let angParentComponent = this;
    console.log(`LoopySurfaceSurfers.ctor: innerGame.buttonPressed=${this.innerGame.buttonPressed(0)}`);
    
    this.yOffset = 2.5;
    this.billBoard['xOrigin'] = 0;
    this.billBoard['yOrigin'] = 1;
    this.billBoard['zOrigin'] = 0;
    let afComp = AFRAME.registerComponent('lss-aframe-component', {
      // init: () => {
      init: function() {
        // setTimeout( () => {
        angParentComponent.initSceneAng();

        // }, 0);
        var customizeBtn = document.querySelector('#customizeBtn');
        // var customizeBtn = document.querySelector('#titleDiv');
        (customizeBtn as any).addEventListener('pressed', function (e) {
          console.log(`customizeBtn pressed`);
          // debugger;
          let custDialogEl = document.querySelector('#custDialog');
          if (!custDialogEl) {
            var dialogEl = document.createElement('a-entity');
            dialogEl.setAttribute('geometry', 'primitive: plane');
            dialogEl.setAttribute('material', 'opacity: 0.5; side: double');
            dialogEl.setAttribute('id', 'custDialog');
            // document.querySelector('a-scene').appendChild(el);
            e.target.appendChild(dialogEl);
          }
          else {
            e.target.removeChild(custDialogEl);
          }
          
          // let titleEl : any = document.querySelector('#titleText')
          // if (titleEl.style.visibility === 'hidden') {
          //   titleEl.style.visibility = 'inline';
          // }
          // else {
          //   titleEl.style.visibility = 'hidden';
          // }
        });
        // var el = this.el;
        // this.el.setAttribute('bmfont-text', {
        //   fntImage: 'assets/fonts/mozillavr.png',
        //   fnt: 'assets/fonts/mozillavr.fnt',
        //   scale: 0.0015,
        //   baseline: 'top',
        //   lineHeight: 90,
        //   // text: buildText(this.system.scores),
        //   text: 'hello cleveland',
        //   // text: ['abc', 'def'],
        //   color: '#24caff'
        // });
      },
      tick:  (time, timeDelta) => {
        // console.log(`LoopySurfaceSurfers.lss-aframe-component.tick: entered`);
        
        // let posData = this.ocLeftController.el.components.position.data;
        // console.log(`LoopySurfaceSurfers.tick: oc-posData.x=${posData.x}, y=${posData.y}, z=${posData.z}`);
      },
      pause: function () {
        console.log(`LoopySurfaceSurfers.lss-aframe-component.pause: entered`);
        
        // this.removeEventListeners()
      },
      play: function () {
        console.log(`LoopySurfaceSurfers.lss-aframe-component.play: entered`);
        // this.addEventListeners()
      }
    });
  }

  // aframeInit() {
  //   AFRAME.registerComponent('lss-aframe-component', {
  //     init: () => {
  //       var el = (this as any).el;
  //     }
  //   });
  // }

  ngOnInit() {
    console.log(`LoopySurfaceSurfers.ngOnInit: entered`);
  }

  // init the parts of the scene than cannot be done via a-frame html
  initSceneAng() {
    // let sceneEl : AFrame.Entity  = document.querySelector('a-scene') as AFrame.Entity;
    let sceneEl  = document.querySelector('a-scene') as AFrame.Entity;
    sceneEl.addEventListener('enter-vr', function () {
      console.log("LoopySurfaceSurfers.initSceneAng: ENTERED VR");
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

    let list = document.querySelectorAll('.scene-select');

    Array.prototype.forEach.call(list, (item) => {
      // item.addEventListener('mouseenter', this.sceneSelectMouseEnter, false);
      // item.addEventListener('mouseleave', this.sceneSelectMouseLeave, false);
      // item.addEventListener('click', this.sceneSelectClick, {once : true});
    })
    ;
    // document.querySelectorAll('.scene-select').addEventListener('mouseleave', this.sceneSelectMouseLeave, false);
    // document.querySelectorAll('.scene-select').addEventListener('click', this.sceneSelectClick, false);

    // this.initControllers();
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
        this.moveCameraByGrip(this.ocRightControllerElem);
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
        this.moveCameraByGrip(this.ocRightControllerElem);
      }
    });

    this.ocRightControllerElem.addEventListener('gripup',  (evt)  => {
      console.log('right grip is up');
      this.gripRightDown = false;
    });
  }

  moveCameraByGrip(el : Element) {
    console.log(`LoopySurfaceSurfersComponent.moveCameraByGrip: entered`);
    // let sceneEl  = document.querySelector('a-scene') as AFrame.Entity;
    // let cameraEl = document.querySelector('#camera') as AFrame.Entity;
    // let cameraObj = cameraEl.object3D;
    let dollyEl = document.querySelector('#dolly') as AFrame.Entity;
    let dollyObj = dollyEl.object3D;

    let controllerEl = document.querySelector('#oc-control-right');
    let controllerObj = (controllerEl as AFrame.Entity).object3D;

    dollyObj.position.x = controllerObj.position.x;
    dollyObj.position.y = controllerObj.position.y;
    dollyObj.position.z = controllerObj.position.z;
  }

  sceneSelectMouseEnter(evt) {
    // evt.currentTarget.setAttribute('color', 'blue');
    evt.target.setAttribute('color', 'blue');
  }

  sceneSelectMouseLeave(evt) {
    // evt.currentTarget.setAttribute('color', '#CCC');
    evt.target.setAttribute('color', '#CCC');
  }

  actionButtonClick(e : Event) {
    console.log(`LoopySurfaceSurfers.actionButtonClick: entered.  Now calling luxor scene`);
    (e.target as any).id='luxor';
    this.sceneSelectClick(e);
  }
  sceneSelectClick2(e : Event) {
    if(this.sceneSelected) return;
    this.sceneSelected = true;
    console.log(`you clicked on scene select 2`);
    console.log(`sceneSelectClick2: e.target.id=${(e.target as HTMLElement).id}`);
  }

  sceneSelectClick(evt) {
    if(this.sceneSelected) return;
    this.sceneSelected = true;
    console.log(`you clicked on scene select evt.target.id=${evt.target.id}`);

    switch(true) {
      case /plane/.test(evt.target.id):
        console.log(`calling plane scene`);
        let componentFactory = this._componentFactoryResolver.resolveComponentFactory(PlaneSceneComponent);
        // let viewContainerRef = this.widgetHost.viewContainerRef;
        let componentRef = this.viewContainerRef.createComponent(componentFactory);
        debugger;
        // this.introScene.nativeElement.createComponent(componentRef);
        // console.log(`lss.doSomething=${this.lss.doSomething()}`);
        (document.querySelectorAll('a-scene')[1] as any).enterVR()
        
        break;

      case /luxor/.test(evt.target.id):
        console.log(`calling luxor scene`);
        // let luxorScene = this.injector.get(LuxorSceneComponent);
        // console.log(`LoopySurfaceSurders.sceneSelectClick: LuxorSceneComponent injected^`);
        /*
        var el = document.querySelector('#intro-scene');
        (el as any).pause();
        el.parentNode.removeChild(el);

        var headerDiv = document.querySelector("#header");
        (headerDiv as any).style.width = window.innerWidth;
        (headerDiv as any).style.height = window.innerHeight;
        this.loadComponent();
        */

        // setTimeout(() => {
        //   console.log(`LoopySurfaceSurders.sceneSelectClick: delayed action click exp`);
        //   var enterVrButton = document.querySelector('.a-enter-vr-button');
        //   (enterVrButton as any).click();
        // },1000);
        // var scene: any = document.querySelector('a-scene');
        // attempt cleanup on parent
        let cameraEl = document.querySelector('#camera');
        (cameraEl as any).setAttribute('wasd-controls', 'inVrState', 'false')
        var el = document.querySelector('#intro-scene');
        // el.exitVR();
        (el as any).sceneEl.exitVR();
        el.parentNode.removeChild(el);
        // and xfer to new url
        this.router.navigateByUrl('/luxorScene', { });
        // this.router.navigateByUrl('/luxorScene', { skipLocationChange: true });
        // console.log(`LoopySurfaceSurders.sceneSelectClick: back from naviate`);
        // window.addEventListener('load', function () {
        //   var scene: any = document.querySelector('a-scene');
        //   if (scene.hasLoaded) {
        //     console.log('Automatically entering VR 1');
        //     scene.enterVR();
        //   }
        //   else {
        //     // scene.el.sceneEl.enterVR();
        //     // (scene.parentEl as any).addEventListener('loaded', function () {
        //     (scene as any).addEventListener('loaded', function () {
        //       console.log('Automatically entering VR 2');
        //       // scene.enterVR();
        //       setTimeout(function () {
        //         console.log('entering VR 3');
        //         var scene: any = document.querySelector('a-scene');
        //         scene.enterVR();
        //       }, 1000);
        //     });
        //   }
        // });
        break;

      case /pool-hall/.test(evt.target.id):
        console.log(`calling pool hall scene`);
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
