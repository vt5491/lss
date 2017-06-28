///<reference path="../../../../typings/index.d.ts" />
import { Component, Injectable, Injector } from '@angular/core';
import { Asteroid } from './asteroid';
import { Bullet } from './bullet';
import { Ship } from './ship';
import { InnerGame } from '../../interfaces/inner-game';
import { ThreeJsSceneProvider } from '../../services/utils.service';
import { BaseService } from '../../services/base.service';
import { UtilsService } from '../../services/utils.service';
import { InnerSceneRendererService } from '../../services/aframe/inner-scene-renderer.service';
import { AsteroidsGameControllerListenerService } from './aframe/asteroids-game-controller-listener.service';
// import { ParmsService } from '../../services/parms.service';
import { IMainCharacterInfo } from '../../interfaces/main-character-info';
import { IMoveableGameObject } from '../../interfaces/imoveable-game-object';

@Component({
})
@Injectable()
export class AsteroidsGame implements InnerGame {

  private _asteroids : Asteroid [] = [];
  private _bullets : Bullet [] = [];
  private _scene: THREE.Scene;
  private asteroidsDuration : number = 60000;
  private startTime : number = Date.now();
  id : number = Date.now();
  BOUND_VAL = 3.79;
  // seedAsteroidCount : number = 4;
  seedAsteroidCount : number = 12;
  // private _gpad : Gamepad;
  // currently there are no typings for gamepad.js, so deal with it as an
  // untyped var. Note: gamepad.js is loaded as a script tag in index.html
  private _gpad : any;
  private gpadFirstPressUsedUp : boolean = false;
  private _lastGpadTimestamp : number = 0;
  //vt add
  // inner scene vars
  private innerWebGLRenderer : THREE.WebGLRenderer;
  private gl_innerWebGLRenderer: WebGLRenderingContext;
  private offscreenBuffer : THREE.WebGLRenderTarget; 
  private innerGameWidth : number;
  private innerGameHeight : number;
  private offscreenImageBuf : THREE.DataTexture;
  private webGLRenderer : THREE.WebGLRenderer;
  private gl_webGLRenderer: WebGLRenderingContext;
  private innerSceneCamera : THREE.PerspectiveCamera;
  private innerSceneRenderer: InnerSceneRendererService;
  private asteroidsGameControllerListener: AsteroidsGameControllerListenerService;
  //vt end

  constructor(
    private _ship : Ship,
    private _base : BaseService,
    private injector : Injector,
    private _utils : UtilsService,
    // private innerSceneRenderer : InnerSceneRendererService,
    // private asteroidsGameControllerListener : AsteroidsGameControllerListenerService,
  ) {
    // I seem to have to manually inject THREE.Scene because it's a third-party Component
    // and I can't wrap it in @Ijnectable?
    this._scene = this.injector.get(THREE.Scene);
    // this.asteroids.push( new Asteroid());
    this.base.projectionBoundary = this.BOUND_VAL;
    // we don't DI this because we need to bind it to our runtime 'this'
    // this.innerSceneRenderer = new InnerSceneRendererService(this);
    this.asteroidsGameControllerListener = new AsteroidsGameControllerListenerService(this);

    this.initScene();

    AFRAME.registerComponent('asteroids-inner-scene-aframe-component', {
      init: () => {

      }
    });

    //vt add
    /*
    AFRAME.registerComponent('asteroids-inner-scene-aframe-component', {
      init: () => {
      // init: function () {
        console.log(`AsteroidsGame.AFRAME.init: entered`);
        console.log(`AsteroidsGame.AFRAME.init: seedAsteroidsCount=${this.seedAsteroidCount}`);
        console.log('dynamicSceneTexture.init: entered');
        this.innerWebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
        this.gl_innerWebGLRenderer = this.innerWebGLRenderer.getContext();
        this.offscreenBuffer = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter })
        this.innerGameWidth = window.innerWidth;
        this.innerGameHeight = window.innerHeight;
        this.offscreenImageBuf = this.generateDataTexture(this.innerGameWidth, this.innerGameHeight, new THREE.Color(0x000000));
        this.innerSceneCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
        this.innerSceneCamera.position.z = 5.0;

      },
      // tick: function (t, dt) {
      tick: (t, dt) => {
        let a = 1;
        
        this.updateScene();
        this.webGLRenderer = (document.querySelector('a-scene') as any).renderer;
        this.gl_webGLRenderer = this.webGLRenderer.getContext();
        // this.innerWebGLRenderer.render(
        this.webGLRenderer.render(
          // this.innerScene,
          // this._scene,
          this.scene,
          this.innerSceneCamera,
          this.offscreenBuffer
          // this.offscreenImageBuf
        );

        try {
          // note: readPixels puts the result into the fourth function arg
          // e.g this.offscreenImageBuf.image.data
          this.gl_webGLRenderer.readPixels(0, 0,
            window.innerWidth, window.innerHeight,
            this.gl_webGLRenderer.RGBA,
            this.gl_webGLRenderer.UNSIGNED_BYTE,
            this.offscreenImageBuf.image.data
          );
        }
        catch (e) {
          console.log(`torus.proj.mainLoop: caught error ${e}`)
        }

    this.offscreenImageBuf.needsUpdate = true; //need this

        if (document.querySelector('#test-plane')) {
          var mesh = (document.querySelector('#test-plane') as any).object3D.children[0];
          mesh.material.map = this.offscreenImageBuf;
          mesh.material.needsUpdate = true;
          mesh.material.map.needsUpdate = true;
          this.offscreenImageBuf.needsUpdate = true; //need this
        }
        // if ((this as any).el.sceneEl.object3D.getObjectByName('Cube')) {
        // document.querySelector('#luxor-model').object3D.getObjectByName('LuxorTower')
        // if (this.scene.getObjectByName('Cube')) {
        // if ((document.querySelector('#luxor-model') as any).object3D.getObjectByName('LuxorTower')) {
        if ((document.querySelector('#luxor-model') as any).object3D.getObjectByName('Cube')) {
          // var mesh = (this as any).el.sceneEl.object3D.getObjectByName('Cube');
          // var mesh = (this.scene.getObjectByName('Cube') as any);
          var mesh = (document.querySelector('#luxor-model') as any).object3D.getObjectByName('Cube');   
          // if(this.el.sceneEl.object3D.getObjectByName('Plane')) {
          //   var mesh = this.el.sceneEl.object3D.getObjectByName('Plane');
          // if(this.el.sceneEl.object3D.getObjectByName('Pyramid')) {
          //   var mesh = this.el.sceneEl.object3D.getObjectByName('Pyramid');
          mesh.material.map = this.offscreenImageBuf;
          mesh.material.needsUpdate = true;
          mesh.material.map.needsUpdate = true;
          this.offscreenImageBuf.needsUpdate = true; //need this
        }
      },
      generateDataTexture: function (width, height, color) {
        var size = width * height;
        var data = new Uint8Array(4 * size);

        var texture = new (THREE.DataTexture as any)(data, width, height, THREE.RGBAFormat)
        texture.needsUpdate = true;

        return texture;
      },
    },
    );
    */
    //vt end
  }

  // generateDataTexture (width, height, color) {
  //   var size = width * height;
  //   var data = new Uint8Array(4 * size);

  //   var texture = new (THREE.DataTexture as any)(data, width, height, THREE.RGBAFormat)
  //   texture.needsUpdate = true;

  //   return texture;
  // };

  initScene() {
    //vt add
    // var geometry = new THREE.BoxGeometry( 2, 3, 1 );
    // // var geometry = new THREE.BoxGeometry( .2, .1, .1 );
    // var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
    // var cube = new THREE.Mesh( geometry, material );

    // this.scene.add(cube);

    // this.innerSceneCamera = new THREE.PerspectiveCamera(75, this.innerGameWidth / this.innerGameHeight);
    // this.innerSceneCamera.position.z = 5.0;
    //vt end
    this.initAsteroids();
    // development hack to make asteroid 0 bigger so we can identify it visually
    this.asteroids[0].mesh.scale.x = 2.0;
    this.asteroids[0].mesh.geometry.computeBoundingBox();

    this.scene.add(this.ship.mesh);

    // add a GridHelper
    // Note: if you go beyond 16.0 it just gets truncated
    let gridXGeom = new THREE.PlaneBufferGeometry(16.0, 0.02);
    let gridYGeom = new THREE.PlaneBufferGeometry( 0.02, 16.0);

    let gridMat = new THREE.MeshBasicMaterial({  side: THREE.DoubleSide});
    gridMat.color = new THREE.Color(200, 200, 200);

    let gridXMesh = new THREE.Mesh(gridXGeom, gridMat);
    gridXMesh.position.x = -3.0;
    gridXMesh.position.z = 0.0;

    let gridYMesh = new THREE.Mesh(gridYGeom, gridMat);
    gridYMesh.position.y = -3.0;
    gridYMesh.position.z = 0.0;

    this.scene.add(gridXMesh);
    this.scene.add(gridYMesh);
  };

  initAsteroids() {
    for (let i = 0; i < this.seedAsteroidCount; i++) {
      let asteroid = new Asteroid(this.base, this.utils, {});

      // set position between projection bounds
      let boundVal = this.base.projectionBoundary;

      asteroid.mesh.position.x = (boundVal * Math.random() * 2.0) - boundVal;
      asteroid.mesh.position.y = (boundVal * Math.random() * 2.0) - boundVal;

      // set velocity
      let asteroidTheta = 2.0 * Math.PI * Math.random();
      //TODO: parameterize the magic numbers
      asteroid.vx = Math.cos(asteroidTheta) * 0.004;
      asteroid.vy = Math.sin(asteroidTheta) * 0.004;

      this.asteroids[i] = asteroid;

      // save mesh id in the parent asteroid obj, to aid in deleting later.
      asteroid.three_id = asteroid.mesh.id;
      this.scene.add(asteroid.mesh);

      // se
    }
  }

  buttonPressed(b) {
    if (typeof (b) == "object") {
      return b.pressed;
    }
    return b == 1.0;
  }

  updateScene() {
    // 3.7 is a little short. 3.8 is a little long
    let boundVal = this.BOUND_VAL;

    // read gamepad
    // this.gamepadHandler();
    // if (this.gpad) {
    //   // if (this.buttonPressed(this.gpad.buttons[0])) {
    //   if (this.gpad.buttons[0].pressed) {
    //     console.log(`AsteroidsGame.updateScene-1: gPad button 0 pressed`);
    //     // (<AsteroidsGame>this.innerGame).shipThrust();
    //   }

    //   console.log(`gpad.axes=${this.gpad.axes[0]}`);
    // }

    
    // this.gpad = new Gamepad();

    // this.gpad.on('press', 'button_1', () => {
    //   console.log('button 1 was pressed!');
    // });
    // this.gpad

    // update asteroids
    for (let i = 0; i < this.asteroids.length; i++) {
      let asteroid = this.asteroids[i];

      asteroid.updatePos();
    }
    // update bullets
    this.updateBullets();

    // translate ship
    this.ship.updatePos();

    // rotate ship
    this.ship.rotate();

    // check for bullet collisions
    let hitObjects = this.bulletCollisionCheck();
    //
    // do beenHit action on each hitObject
    for (let i = 0; i < hitObjects.length; i++) {
        // let hitObj = hitObjects[0];
        let hitObj = hitObjects[i]['obj'];
        let hitIdx = hitObjects[i]['idx'];

        hitObj.collisionHandler();

        switch(hitObj.tag) {
          case 'asteroid':
            let splitAsts : Asteroid[];
            splitAsts = (<Asteroid>hitObj).collisionHandler();

            var selectedObject = this.scene.getObjectById((<Asteroid>hitObj).three_id);
            this.scene.remove( selectedObject );
            this.removeAsteroid(hitIdx, hitObj);

            for( let k=0; k < splitAsts.length; k++) {
              this.asteroids.push(splitAsts[k]);
              this.scene.add(splitAsts[k].mesh);
            }

            // console.log(`AsteroidsGame.updateScene: asteroid count=${this.asteroids.length}`);

          break;
        }
    }
  };

  updateBullets() {
    // we have to work our way through the bullets array in reverse order because
    // the splicing can affect 'downstream' array maniuplation
    for (let i = this.bullets.length -1 ; i >=0; i--) {
      let bullet = this.bullets[i];

      bullet.update();

      if (bullet.ttl <= 0) {
        this.removeBullet(i, bullet);
      }
    };
  }

  removeBullet(index, bullet) {
    this.bullets.splice(index, 1);

    this.scene.remove(bullet.mesh);
  }

  removeAsteroid(index, asteroid) {
    this.asteroids.splice(index, 1);

    this.scene.remove(asteroid.mesh);
  }

  // this is the main application level bullet handler.  We are called from asteroids-kbd-handler'
  shipFiredBullet() {
    // create a bullet with same direction as the ship is pointing to
    // note: we do not use injected Bullets because we don't want singletons
    let bullet = new Bullet(this.base);
    bullet.vTheta = this.ship.theta;

    let tmpVec = new THREE.Vector3();
    // initial pos is the same as the ship
    bullet.mesh.position.x = this.ship.mesh.position.x;
    bullet.mesh.position.y = this.ship.mesh.position.y;

    // add the mesh to the scene
    this.scene.add(bullet.mesh);

    // and add to the bullets array
    this.bullets.push(bullet);
  };

  shipThrust(throttleFactor? : number) {
    this.ship.thrust();
  }

  // this returns info about the main user controlled screen avatar.  It can
  // can be used by the outer scene to change the position of the outer camera
  // to track the main inner object, for example.
  getMainCharacterInfo() : IMainCharacterInfo {
    let info = new Object();

    info['pos'] = {};
    info['pos'].x = this.ship.mesh.position.x;
    info['pos'].y = this.ship.mesh.position.y;
    info['pos'].z = this.ship.mesh.position.z;

    return <IMainCharacterInfo>info;
  };

  // loop through all the bullets and see if it's hit any of the game objects
  // return an array of all objects that have been hit
  // bulletCollisionCheck() : IMoveableGameObject[] {
  // bulletCollisionCheck() : {[idx : string] : number,  [obj : string] :IMoveableGameObject}[] {
  bulletCollisionCheck() : any[] {
    // { [id: string] : SimpleLayer }
    let collisionObjects = [];

    //loop through all bullets
    for (let i = 0; i < this.bullets.length; i++) {
      let b = this.bullets[i];
      //loop through all asteroids
      for (let j = 0; j < this.asteroids.length; j++) {
        let a = this.asteroids [j];

        if (a.collisionTest(b.mesh.position)) {
          // collisionObjects.push(a);
          collisionObjects.push({ 'idx' : j, 'obj' : a});

          // and remove the bullet since it's "spent"
          // this.bullets.splice(i, 1);
          this.removeBullet(i, b);
        }
      }
    }

    //TODO: return the index of the asteroid as well.
    // return it as object, not an array.
    return collisionObjects;
  }

  // handle any gamepad events
  // gamepadHandler() : void {
  //   var gPads = navigator.getGamepads ? navigator.getGamepads() : [];

  //   if (gPads) {
  //     var gpad = gPads[0];
       
  //     if (gpad) {
  //       if (gpad.buttons[0].pressed && !this.gpadFirstPressUsedUp) {
  //         console.log(`AsteroidsGame.updateScene-2: gPad button 0 pressed`);
  //         this.gpadFirstPressUsedUp = true;

  //         this.shipFiredBullet();
  //       } 
  //       else if (!gpad.buttons[0].pressed) {
  //         this.gpadFirstPressUsedUp = false;
  //       }

  //       if (gpad.buttons[2].pressed) {
  //         console.log(`AsteroidsGame.updateScene: gPad button 2 pressed`);
  //         // scale down the thrust factor by 1/30 since the accel is tuned
  //         // for the keyboard and kbd events only fire at approx. 1/30 the rate
  //         // of animationFrame rates.
  //         this.shipThrust( 1 / 120);
  //       }

  //       // this.ship.theta = gpad.axes[0] * Math.PI;
  //       // this.ship.theta = this.utils.applyDeadzone(gpad.axes[0], 0.25) * Math.PI;
  //       let shipRotateAxisValue= this.utils.applyDeadzone(gpad.axes[0], 0.25);

  //       if (shipRotateAxisValue < 0) {
  //         this.ship.theta += this.ship.deltaTheta * (1/3);
  //       }
  //       else if (shipRotateAxisValue > 0) {
  //         this.ship.theta -= this.ship.deltaTheta * (1 / 3);
  //       }

  //       // camera movement
  //     }
  //   }
  // }


  //getters and setters
  get asteroids(): Asteroid [] {
    return this._asteroids;
  };
  get scene(): THREE.Scene {
    return this._scene;
  };
  get ship(): Ship {
    return this._ship;
  };
  get bullets(): Bullet [] {
    return this._bullets;
  };
  get base(): BaseService {
    return this._base;
  };
  get utils(): UtilsService {
    return this._utils;
  };

  // get gpad(): Gamepad {
  get gpad(): any {
    return this._gpad;
  };

  // set gpad(gp : Gamepad) {
  set gpad(gp : any) {
    this._gpad = gp;
  };

  get lastGpadTimestamp(): number {
    return this._lastGpadTimestamp;
  };

  set lastGpadTimestamp(gp : number) {
    this._lastGpadTimestamp = gp;
  };
}
