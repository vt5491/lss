///<reference path="../../../typings/index.d.ts" />
// <reference path="../../../node_modules/es6-promise/es6-promise.d.ts" />
//<reference path="../../../node_modules/@types/core-js/index.d.ts" />
import { Injectable, Injector } from '@angular/core';
import { IMoveableGameObject } from '../interfaces/imoveable-game-object';
// import { ParmsService } from './parms.service';
import { BaseService } from './base.service';
import { Asteroid } from '../inner-games/asteroids/asteroid';
// import { LssScene } from "../interfaces/lss-scene";
// import * as _ from 'lodash';
// import {GUI} from 'dat.GUI';
// import {dat} from 'dat-gui/vendor/dat.gui';
// declare var dat: any;
// import * as dat from 'dat-gui';
// import * as dat from 'dat';
// import * from 'dat-gui';
// these work
// import * as dat from 'dat.GUI';
// import * as Stats from 'stats-js';

@Injectable()
export class UtilsService {

  // declare var dat.GUI: any;
  // datGUI : dat.GUI;
  // stats : Stats;
  parms : any;
  public log : any;

  constructor(
    private injector: Injector,
    private base : BaseService
    // private datGUI : dat.GUI
    ) {
    // console.log(`UtilsService: now in ctor`);
    // this.datGUI = this.injector.get(dat.GUI);
    // this.datGUI = new dat.GUI();
    // this.addControls();
    // console.log(`UtilsService.cotr: datGUI=${this.datGUI}}`);

    this.parms = {};

    // Do not log in production.
    var debug = window.location.protocol !== 'https:';
    this.log = debug ? console.log.bind(console) : function () {};
  }

  doNothing() {
    return 7;
  }

  addControls(controlObject) {
    // this.datGUI.add( controlObject, 'canvasWidth', 500, 1000);
    // this.datGUI.add( controlObject, 'this.sspScene.sspSurface.position.x', 500, 1000);
  };

  addStats() {
    // this.stats = new Stats();
    // this.stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    // (<any> this.stats).setMode(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    // document.body.appendChild( this.stats.dom );
    // document.body.appendChild( (<any>this.stats).domElement );
    // document.getElementsByTagName('h1')[0].appendChild( (<any>this.stats).domElement );
    // this puts it at the top
    // let appRootElem = document.getElementsByTagName('app-root')[0];
    let insertPointElem = document.getElementById('webgl-container');

    // insertPointElem.insertBefore(
    //   (<any>this.stats).domElement,
    //   insertPointElem.childNodes[insertPointElem.childNodes.length - 1] );
  }

  updatePos(moveableGameObject: IMoveableGameObject, boundVal: number) {
    // console.log(`Utils.UpdatePos: entered`);

    let meshX = moveableGameObject.mesh.position.x;
    let meshY = moveableGameObject.mesh.position.y;
    // if (moveableGameObject.tag === 'ship') {
    //   console.log(`Utils.updatePos: meshX=${meshX}, meshY=${meshY}`);
    // }

    meshX += moveableGameObject.vx;
    meshY += moveableGameObject.vy;

    if (meshX > boundVal) {
      meshX = -boundVal;
    }

    if (meshX < -boundVal) {
      meshX = boundVal;
    }

    if (meshY > boundVal) {
      meshY = -boundVal;
    }

    if (meshY < -boundVal) {
      meshY = boundVal;
    }

    moveableGameObject.mesh.position.x = meshX;
    moveableGameObject.mesh.position.y = meshY;
  }

  getGamepad() {

  }

  // this is the template function for getting gamepad Object.  It's up to
  // the caller to wrap this in a cluser so the gpad object is set locally
  // initGamepadConnectedListener(cb : () => boolean) {
  // initGamepadConnectedListener(cb : () => boolean) {
  getGamepadConnectedPromise() {
    return new Promise((resolve, reject) => {
      window.addEventListener("gamepadconnected", function (e : any) {
        console.log(`Gamepad connected at index${e.gamepad.index}`);
        // this.gPad = navigator.getGamepads()[e.gamepad.index];
        resolve(navigator.getGamepads()[e.gamepad.index]);
      });
    });
  }

  // apply a deadzone to a gamepad axis value
  applyDeadzone(axisValue: number, threshold: number) {
    let percentage = (Math.abs(axisValue) - threshold) / (1 - threshold);

    if (percentage < 0)
      percentage = 0;

    return percentage * (axisValue > 0 ? 1 : -1);
  }

  // Because the sspSurface and sspMaterial variables will be nested two functions
  // deep at the time they are updated, we can't rely on simple pass by reference
  // to update them properl.
  // (empirically determined during testing).  Thus we have to pass closure functions
  // that update them instead:
  // example:
  //   let sspSurfaceUpdateFn = (newMesh) => {
  //   sspSurface = newMesh;
  // };
  //TODO: this is really the OBJ loader, not a JSON loader.  However, merely swapping
  // in JSONLoader doesn't fix the problem as Json object has no children
  // No: JSONLoader has been replaced by OBJLoader
  loadJsonModel(fp, scene, sspName, sspSurfaceUpdateFn, sspMaterialUpdateFn) {
    console.log(`Utils.loadJsonModel: fp=${fp}`);

    var loader = new THREE.ObjectLoader();
    // var loader = new THREE.JSONLoader();
    // debugger;

    var promise = new Promise((resolve, reject) => {
      loader.load(
        fp,
        (blenderScene) => {
          console.log(`blenderScene.children.length=${blenderScene.children.length}`);

          for (var i = 0; i < blenderScene.children.length; i++) {
            var blenderMesh : THREE.Mesh = blenderScene.children[i] as THREE.Mesh;
            // Note: bug in three.js if you directly refer to the loaded mesh.  When you add to the
            // scene it will delete *some other* element from the blenderScene.children array.
            // So we have to manually create our mesh and copy in the blenderScene's child geometry
            // and material
            var mesh = new THREE.Mesh(blenderMesh.geometry as THREE.BufferGeometry, blenderMesh.material);
            // debugger;
            mesh.name = blenderMesh.name;
            // mesh.scale.set(25, 25, 25);
            if (mesh.name === sspName) {
              // mesh.rotateX(-Math.PI / 2.0);
              // sspSurface.$parent = mesh;
              sspSurfaceUpdateFn(mesh);
              // sspSurface.name = 'vt was here';
              // sspMaterial = mesh.material;
              sspMaterialUpdateFn(mesh.material);
            }
            scene.add(mesh);
          }
          resolve("loaded");
        })
    });

    return promise
  }

  // loadObjModel()  {
  loadObjModel(fpMtl, fpObj, scene, sspName, sspSurfaceUpdateFn, sspMaterialUpdateFn) {
    console.log('now in loadObjModel');
    var promise = new Promise(function(resolve, reject) {
    var mtlLoader = new (THREE as any).MTLLoader();
    mtlLoader.load( fpMtl, function( materials ) {
      console.log(`loadObjModel: materials=${materials}`);
      materials.preload();
      var loader = new (THREE as any).OBJLoader();
      loader.setMaterials(materials);
      loader.load( fpObj, function(object) {
        console.log(`loadObjModel: object.children.length=${object.children.length}`);
        for (var i = 0; i < object.children.length; i++) {
          let defaultMat = new THREE.MeshBasicMaterial(
            {
              color: Math.random() * 500000 + 500000,
              wireframe: false,
              side: THREE.DoubleSide
            }
          );
          let obj = object.children[i];

          if( obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
            // if( obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
            // if(  obj instanceof THREE.LineSegments) {
                // let mesh= new THREE.Mesh(obj.geometry as THREE.BufferGeometry, defaultMat);
                let mesh= new THREE.Mesh(obj.geometry as THREE.BufferGeometry, obj.material);
                // let mesh= new THREE.Mesh(obj.geometry as THREE.Geometry, obj.material);
                // var bufferGeometry = new THREE.BufferGeometry().fromGeometry( obj.geometry );
                // let mesh= new THREE.Mesh(bufferGeometry as THREE.BufferGeometry, obj.material);
            // }
            mesh.material = defaultMat;
            mesh.scale.set(25,25,25);
            // by adding this, I no longer get the pyramid, for some strange reason.kkkkjj
            // the reason is becuase the mesh created from obj is not "capable" enough somehow
            // to accomodate the dynamic texturing in ssp-runtime
            mesh.name = obj.name;

            // if (mesh.name === sspName) {
            if (mesh.name.match(sspName)) {
              mesh.material = defaultMat;
              sspSurfaceUpdateFn(mesh);
              sspMaterialUpdateFn(mesh.material);
            }
            // this.scene.add(mesh);
            scene.add(mesh);
          }
        }
        resolve("loadedObj");
      }.bind(this), () => {}, () => {} );
    }.bind(this));
  }.bind(this))
    return promise;
  }

  loadColladaModel(fp, scene, sspName,
    sspSurfaceUpdateFn, sspMaterialUpdateFn,
    setAnimationsClosure, getKfAnimationsClosure
    ) {
      console.log(`now in loadColladaModel`);
      var loader = new (THREE as any).ColladaLoader();
      loader.options.convertUpAxs = true;

      // var mat = new THREE.MeshBasicMaterial({color: 0x806040, side: THREE.DoubleSide})

      var promise = new Promise( (resolve, reject) => {
        // loader.load( 'assets/cube.dae', (collada) => {
        // loader.load( 'assets/luxorPyramidScene.dae', (collada) => {
        loader.load( fp, (collada) => {
          console.log(`now in collada load closure`);
          let dae = collada.scene
          dae.rotateX(-Math.PI / 2.0);
          dae.scale.x = dae.scale.y = dae.scale.z = 15.0;
          dae.updateMatrix();
          scene.add(dae);

          //vt add
          // animations = collada.animations;
          setAnimationsClosure(collada.animations);
          let animations = collada.animations;
          // kfAnimationsLength = animations.length;
          // model.scale.x = model.scale.y = model.scale.z = 0.125; // 1/8 scale, modeled in cm
          // model.scale.x = model.scale.y = model.scale.z = 5.0; // 1/8 scale, modeled in cm

          for (var i = 0; i < animations.length; ++i) {
            var animation = animations[i];

            var kfAnimation = new (THREE as any).KeyFrameAnimation(animation);
            kfAnimation.timeScale = 1;
            // kfAnimations.push(kfAnimation);
            getKfAnimationsClosure().push(kfAnimation);
          }
        //vt end
          resolve('loaded');
        })
      })

      return promise;
  }

  loadTexture (fp) {
    let promise = new Promise((resolve, reject) => {
      console.log(`Utils: point a`);

      let loader = new THREE.TextureLoader();
      // debugger;
      loader.load(fp, (texture) => {
        console.log(`Utils: point b, texture=${texture}`);
        resolve(texture);
      })
    })

    return promise;
  }

  sspSurfaceUpdateFn = function(newMesh) {
    console.log('SspCylScene.init: now in sspSurfaceUpdateFn');
    this.sspSurface = newMesh;
  };

  sspMaterialUpdateFn = function(newMaterial) {
    console.log('SspCylScene.init: now in sspMaterialUpdateFn');
    this.sspMaterial = newMaterial;
  };

  startColladaAnimations = function (animations, kfAnimations) {
    for (var i = 0; i < animations.length; ++i) {
      var animation = kfAnimations[i];

      for (var h = 0, hl = animation.hierarchy.length; h < hl; h++) {
        var keys = animation.data.hierarchy[h].keys;
        var sids = animation.data.hierarchy[h].sids;
        var obj = animation.hierarchy[h];

        if (keys.length && sids) {
          for (var s = 0; s < sids.length; s++) {
            var sid = sids[s];
            var next = animation.getNextKeyWith(sid, h, 0);

            if (next) next.apply(sid);
          }

          obj.matrixAutoUpdate = false;
          animation.data.hierarchy[h].node.updateMatrix();
          obj.matrixWorldNeedsUpdate = true;
        }
      }
      animation.loop = false;
      // console.log(`Utils.startColladaAnimations: about to play animation ${animation.data.name}`);
      animation.play();
    }
  }

  trackDollySpherical (pos : THREE.Vector3, lssScene : any ) {
    let longitude = (pos.x / lssScene.base.projectionBoundary) * Math.PI + 1 * Math.PI / 2;
    let latitude = (pos.y / lssScene.base.projectionBoundary) * Math.PI + 0 * Math.PI /2;
    latitude /= 2.0;
    // let radius = 5.0
    let radius = lssScene.dollyRadius;
    // Note: as I understand it X (horizontal) is associated with longitude and y (vertical)
    // is associated with latitude.   However, in the relative rotations, we have to use
    // the opposite.  I don't know why this is: it just is.
    // Just note that in the following the "RotX" is dealing with the y direction, and
    // "RotY" is dealing with the sideways rotation.  I tried "flipping" these semantics
    // but things just didn't work out, so I don't think this is just a coding problem.
    // see https://stackoverflow.com/questions/11030101/three-js-camera-flying-around-sphere
    // this.dollyRotX.identity();
    if (lssScene.outerSceneSvc.discreteInnerSceneScroll) {
      lssScene.dollyRotX.makeRotationX(-lssScene.lastLatitude);
      if (Math.abs(latitude - lssScene.lastLatitude) > lssScene.innerSceneScrollQuanta) {

        if (latitude > lssScene.lastLatitude) {
          lssScene.dollyRotX.makeRotationX(-1 * latitude);
          lssScene.lastLatitude = lssScene.lastLatitude + lssScene.innerSceneScrollQuanta / 1;
        }
        else {
          lssScene.dollyRotX.makeRotationX(-1 * latitude);
          lssScene.lastLatitude = lssScene.lastLatitude - lssScene.innerSceneScrollQuanta;
        }
      }
    }
    else {
      // debugger;
      lssScene.dollyRotX.makeRotationX(-latitude);
    }

    if (lssScene.outerSceneSvc.discreteInnerSceneScroll) {
      lssScene.dollyRotY.makeRotationY(lssScene.lastLongitude);
      if (Math.abs(longitude - lssScene.lastLongitude) > lssScene.innerSceneScrollQuanta) {
        if (longitude > lssScene.lastLongitude) {
          lssScene.dollyRotY.makeRotationY(longitude);
          lssScene.lastLongitude = lssScene.lastLongitude + lssScene.innerSceneScrollQuanta;
        }
        else {
          lssScene.dollyRotY.makeRotationY(longitude);
          lssScene.lastLongitude = lssScene.lastLongitude - lssScene.innerSceneScrollQuanta;
        }
      }
    }
    else {
      lssScene.dollyRotY.makeRotationY(longitude);
    }

    lssScene.dollyTranslation.makeTranslation(0, 0, radius);
    // Note: the order of mults is important on the following line
    lssScene.dollyTransform = lssScene.dollyRotY.multiply(lssScene.dollyRotX);
    lssScene.dollyTransform.multiply(lssScene.dollyTranslation);

    lssScene.outerSceneSvc.dolly.matrix.identity();
    lssScene.outerSceneSvc.dolly.applyMatrix(lssScene.dollyTransform);
  }

  // Note how we only rotate about the x-axis and don't move up and down in the y.
  // This is because we want to minimize the amount of acceleration experienced by the user.
  // It might useful in the future to add a "full" track, but I'm leaving it for now with
  // a minimalist scroll because I think it works pretty good.
  trackDollyCylinder (pos : THREE.Vector3, lssScene : any ) {
    let boundVal = lssScene.base.projectionBoundary;
    let longitude = (pos.x / boundVal) * Math.PI + -1 * Math.PI / 1;

    let radius = lssScene.dollyRadius;

    lssScene.dollyRotY.makeRotationY(longitude);

    lssScene.dollyTranslation.makeTranslation(0, 0, radius);
    lssScene.dollyTransform = lssScene.dollyRotY.multiply(lssScene.dollyTranslation);

    let outerScene = lssScene.outerSceneSvc;
    outerScene.dolly.matrix.identity();
    outerScene.dolly.applyMatrix(lssScene.dollyTransform );

    // sync the entity level position
    // outerScene.dollyEl.setAttribute("position", outerScene.dolly.position);

    // lssScene.dollyRotX.makeRotationX(-lati)

    // let theta = (Math.PI / boundVal) * pos.x;
    // theta += Math.PI;

    // result.x = Math.sin(theta);
    // result.z = Math.cos(theta);

    // result.y = innerY;

    // result.rotQuat = new THREE.Quaternion();
    // result.rotQuat.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), theta );
  }

  // sync the position at the entity level to that of the underlying object3d, in
  // cases where we maniuplate the object3d, but may want to have other elements
  // still be able to refer to the position via dom attributes.
  syncEntityPos(el: AFrame.Entity, obj: THREE.Object3D) {
    el.setAttribute("position", obj.position);
  }

  // The following obtained from:
  // https://github.com/miohtama/Krusovice/blob/master/src/tools/fade.js
    /**
     * Start audio playing with fade in period.
     *
     * Equals to audio.play() but with smooth volume in.
     *
     * @param {Object} audio HTML5 audio element
     * @param {Number} (optional) rampTime How long is the fade in ms
     * @param {Number} targetVolume Max volume. 1 = default = HTML5 audio max.
     * @param {Number} tick Timer period in ms
     *
     */
    fadeIn(audio, rampTime?, targetVolume?, tick?) {
      // (document as any).LSS['ship-thrust-reset'] = false;

      if (!targetVolume) {
        targetVolume = 1;
      }

      // By default, ramp up in one second
      if (!rampTime) {
        rampTime = 1000;
      }

      // How often adjust audio volume (ms)
      if (!tick) {
        tick = 50;
      }

      var volumeIncrease = targetVolume / (rampTime / tick);

      var playingEventHandler = null;

      function ramp() {

        var vol = Math.min(targetVolume, audio.volume + volumeIncrease);

        audio.volume = vol;

        // Have we reached target volume level yet?
        if (audio.volume < targetVolume) {
          // Keep up going until 11
          setTimeout(ramp, tick);
        }
      }

      function startRampUp() {

        // For now, we capture only the first playing event
        // as we assume the user calls fadeIn()
        // every time when wants to resume playback
        audio.removeEventListener("playing", playingEventHandler);

        ramp();
      }

      // Start with zero audio level
      audio.volume = 0;

      // Start volume ramp up when the audio actually stars to play (not when begins to buffer, etc.)
      audio.addEventListener("playing", startRampUp);

      audio.play();
    };
  /**
   * Stop audio playing with fade out period.
   *
   * Equals to audio.pause() but with smooth volume out.
   *
   * @param {Object} audio HTML5 audio element
   * @param {Number} (optional) rampTime How long is the fade in ms
   * @param {Number} targetVolume Min volume. 0 = default = HTML5 audio min.
   * @param {Number} tick Timer period in ms
   *
   */
    fadeOut (audio, rampTime?, targetVolume?, tick?) {
      // debugger;
      var orignalVolume = audio.volume;
      //
      if (!targetVolume) {
        targetVolume = 0;
      }

      // By default, ramp up in one second
      if (!rampTime) {
        rampTime = 1000;
      }

      // How often adjust audio volume (ms)
      if (!tick) {
        tick = 50;
      }

      var volumeStep = (audio.volume - targetVolume) / (rampTime / tick);

      if (!volumeStep) {
        // Volume already at 0
        return;
      }

      function ramp() {
        var vol = Math.max(0, audio.volume - volumeStep);

        audio.volume = vol;

        // Have we reached target volume level yet?
        if (audio.volume > targetVolume && !(document as any).LSS['ship-thrust-reset']) {
          // Keep up going until 11
          setTimeout(ramp, tick);
        }
        else {
          audio.pause();
          (document as any).LSS['ship-thrust-reset'] = false;
          // Reset audio volume so audio can be played again
          audio.volume = orignalVolume;
        }
      }

      ramp();
    };

    // get log() : any {
    //   return this._log;
    // }


  // };
  getHandControlEntity(pos: String) {
    // return all entites with a hand-controllers components
    let controlEntities : any = document.querySelectorAll("[hand-controls]");

    for( let i=0; i < controlEntities.length; i++) {
      if (controlEntities[i].components['hand-controls'].attrValue === pos) {

        return controlEntities[i];
      }
    }
  }

} // end UtilsService class def


// here's where we define the providers for things that don't have their own native
// class with the app.
// Note: these are not functions that are part of the utils class.  If you add any
// methods to the utils class add them above
export let WebGLRenderTargetProvider = {
  provide: THREE.WebGLRenderTarget,
  useFactory: () => {
    return new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter })
  },
};

export let ThreeJsSceneProvider = {
  provide: THREE.Scene,
  // useFactory: () => {
  useFactory: function () {
    return new THREE.Scene();
  },
};

export let ThreeJsWebGLRendererProvider = {
  provide: THREE.WebGLRenderer,
  useFactory: () => {
    return new THREE.WebGLRenderer({antialias : true});
  },
};

export let AsteroidNoParmsProvider = {
    provide: Asteroid,
    useFactory: (base, utils) => {
      return new Asteroid(base, utils, {});
    },
    deps: [BaseService, UtilsService]
  }
// experimental
// export let DatGUIProvider = {
//   provide: dat.GUI,
//   // provide: dat.gui,
//   useFactory: () => {
//     return new dat.GUI();
//   },
// };
