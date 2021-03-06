///<reference path="../../../../typings/index.d.ts" />
import { Component, Injectable, Injector } from '@angular/core';
import { Asteroid, AsteroidNoParmsProvider } from './asteroid';
import { Bullet } from './bullet';
import { Ship } from './ship';
import { InnerGame } from '../../interfaces/inner-game';
import { ThreeJsSceneProvider } from '../../services/utils.service';
import { BaseService } from '../../services/base.service';
import { UtilsService } from '../../services/utils.service';
import { InnerSceneRendererService } from '../../services/aframe/inner-scene-renderer.service';
import { AsteroidsGameControllerListenerService } from './aframe/asteroids-game-controller-listener.service';
import { IMainCharacterInfo } from '../../interfaces/main-character-info';
import { IMoveableGameObject } from '../../interfaces/imoveable-game-object';


//@Component({
//})
@Injectable()
export class AsteroidsGame implements InnerGame {

  private _asteroids : Asteroid [] = [];
  private _bullets : Bullet [] = [];
  private _scene: THREE.Scene;
  private asteroidsDuration : number = 60000;
  private startTime : number = Date.now();
  id : number = Date.now();
  BOUND_VAL = 3.79;
  seedAsteroidCount : number = 12;
  // private _gpad : Gamepad;
  // currently there are no typings for gamepad.js, so deal with it as an
  // untyped var. Note: gamepad.js is loaded as a script tag in index.html
  private _gpad : any;
  private gpadFirstPressUsedUp : boolean = false;
  private _lastGpadTimestamp : number = 0;
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
  public shipRotFactor : number = 4.0;
  public score : number = 0;
  public gamePaused: boolean = false;
  private rightHandController : any;

  constructor(
    private _ship : Ship,
    private _base : BaseService,
    private injector : Injector,
    private _utils : UtilsService,
    //vt-x add
    // private asteroidsGameControllerListener : AsteroidsGameControllerListenerService,
  ) {
    // I seem to have to manually inject THREE.Scene because it's a third-party Component
    // and I can't wrap it in @Ijnectable?
    this._scene = this.injector.get(THREE.Scene);
    // this.asteroids.push( new Asteroid());
    // this.base.projectionBoundary = this.BOUND_VAL;
    this.base.projectionBoundary = this.base.projectionBoundary;
    // we don't DI this because we need to bind it to our runtime 'this'
    // this.innerSceneRenderer = new InnerSceneRendererService(this);
    // this.asteroidsGameControllerListener = new AsteroidsGameControllerListenerService(this, this._base, this._utils);
    this.asteroidsGameControllerListener = new AsteroidsGameControllerListenerService(this._base, this._utils);
    this.asteroidsGameControllerListener.asteroidsGame = this;
    // this.rightHandController = this.utils.getHandControlEntity('right');

    this.initScene();

    if (! AFRAME.components['asteroids-inner-scene-aframe-component']) {
      AFRAME.registerComponent('asteroids-inner-scene-aframe-component', {
        init: () => {
        }
      });

    }

  }

  initScene() {
    console.log('AsteroidsGame.initScene: entered');
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

    let axisHelper = new THREE.AxisHelper(1);
    // let axisHelper = new THREE.AxesHelper(1);
    this.scene.add(axisHelper);
  };

  initAsteroids() {
    for (let i = 0; i < this.seedAsteroidCount; i++) {
      let asteroid = new Asteroid(this.base, this.utils, {});
      // let asteroid = new Asteroid(this.base, this.utils);
      // let asteroid = new Asteroid(this.base, this.utils, {} as any);
      // let asteroid = new Asteroid(this.base, this.utils);
      // let asteroid = new AsteroidNoParmsProvider(this.base, this.utils);

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
    }
  }

  buttonPressed(b) {
    if (typeof (b) == "object") {
      return b.pressed;
    }
    return b == 1.0;
  }

  updateScene(dt? : number) {
    // 3.7 is a little short. 3.8 is a little long
    let boundVal = this.BOUND_VAL;

    // update asteroids
    for (let i = 0; i < this.asteroids.length; i++) {
      let asteroid = this.asteroids[i];

      asteroid.updatePos(dt);
    }
    // update bullets
    this.updateBullets(dt);

    // translate ship
    this.ship.updatePos(dt);

    // rotate ship
    // ship's rotate theta is under the control of 'asteroids-game-controller-listener'
    // and is event driven on a different tick, therefore we can't do a SimpleLayer
    // dt movement on it.
    this.ship.rotate();

    // check for asteroids hitting the ship
    if( this.asteroidShipCollisionCheck()) {
      console.log('ship hit');
      this.ship.reset();
    }
    // check for bullet collisions
    let hitObjects = [];
    hitObjects = hitObjects.concat(this.bulletCollisionCheck());
    //
    // do beenHit action on each hitObject
    for (let i = 0; i < hitObjects.length; i++) {
      let hitObj = hitObjects[i]['obj'];
      let hitIdx = hitObjects[i]['idx'];

      hitObj.collisionHandler();

      switch(hitObj.tag) {
        case 'asteroid':
          let splitAsts : Asteroid[];
          splitAsts = (<Asteroid>hitObj).collisionHandler();

          var selectedObject = this.scene.getObjectById((<Asteroid>hitObj).three_id);
          this.score += hitObj.hitValue;
          let rhc = this.rightHandController ? this.rightHandController : (this.rightHandController = this.utils.getHandControlEntity('right'));
          rhc.emit('scoreChange', this.gameState);
          this.scene.remove( selectedObject );

          this.removeAsteroid(hitIdx, hitObj);

          for( let k=0; k < splitAsts.length; k++) {
            this.asteroids.push(splitAsts[k]);
            this.scene.add(splitAsts[k].mesh);
          }
        break;
      }
    }
  };

  updateBullets(dt) {
    // we have to work our way through the bullets array in reverse order because
    // the splicing can affect 'downstream' array maniuplation
    for (let i = this.bullets.length -1 ; i >=0; i--) {
      let bullet = this.bullets[i];

      bullet.update(dt);

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
    let bullet = new Bullet(this.base, this.utils);
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

    // return it as object, not an array.
    return collisionObjects;
  }

  asteroidShipCollisionCheck() : boolean {
    // let collisionObjects = [];
    let shipHit = false;

    //loop through all asteroids
    for (let i = 0; i < this.asteroids.length; i++) {
      let asteroid = this.asteroids[i];
      // see if it hit the ship
      // if (this.ship.collisionTest(asteroid.mesh.position)) {
      if (this.ship.asteroidCollisionTest(asteroid)) {
        // collisionObjects.push({ 'idx' : i, 'obj' : this.ship});
        shipHit = true;
        break;
      }
    }

    return shipHit;
  }

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
  // set ship(ship: Ship) {
  //   this._ship = ship;
  // };
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

  get gameState() : Object {
    let gameState = {};

    gameState['gamePaused'] = this.gamePaused;
    gameState['score'] = this.score;
    gameState['asteroidsRemaining'] = this.asteroids.length;

    return gameState;
  }
}
