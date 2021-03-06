///<reference path="../../../../typings/index.d.ts" />
import { Injectable } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { UtilsService } from '../../services/utils.service';
import { IMoveableGameObject } from "../../interfaces/imoveable-game-object";
import { Asteroid } from "./asteroid";

@Injectable()
export class Ship implements IMoveableGameObject {
  tag : string;
  vx : number;
  vy : number;
  deltaVx : number;
  deltaVy : number;
  private V_MAX : number = 0.03;
  private _VX_MAX : number = this.V_MAX;
  private _VY_MAX : number = this.V_MAX;
  deltaVel : number;
  deltaTheta : number;
  geom: THREE.Geometry;
  // geom: THREE.BufferGeometry;
  mat : THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
  lineMesh: THREE.Line;
  theta : number;
  thetaLast : number;
  vel : number;  //TODO defunct
  vScalar : number; // use this
  accelScalar : number;
  nose : THREE.Mesh;
  // boundingBox : Object;

  constructor(
    private _base : BaseService,
    private _utils : UtilsService
  ) {

    this.init();
  }

  init() {
    this.tag = 'ship';
    this.vx = 0.0;
    this.vy = 0.0;
    //  this controls how fast the ship goes
    this.vScalar = 0.002;
    this.accelScalar = 0.0003;

    this.deltaVx = 0.001;
    this.deltaVy = 0.001;
    this.deltaVel = 0.0001;
    this.deltaTheta = 10.0 * this.base.ONE_DEG;

    // this makes it go in the up y-dir
    // this.theta = this.base.ONE_DEG * 0.0;
    // this makes it go in the neg x-dir
    this.theta = this.base.ONE_DEG * 90.0;
    // this makes it go in the pos x-dir
    // this.theta = this.base.ONE_DEG * -90.0;
    this.thetaLast = this.theta;

    // create the ship
    // note: have to use Geometry as currently written, since 'vertices' does not exist
    // on BufferGeometry.
    this.geom = new THREE.Geometry()
    // this.geom = new THREE.BufferGeometry()

    let scaleX = 0.1;
    let scaleY = 0.1;
    this.geom.vertices.push(new THREE.Vector3(0 * scaleX, 1 * scaleY))
    this.geom.vertices.push(new THREE.Vector3(.5 * scaleX, -1 * scaleY))
    this.geom.vertices.push(new THREE.Vector3(-.5 * scaleX, -1 * scaleY))

    //set the boundingRadius
    // this.boundingBox = {};
    // this.boundingBox['x'] = 0.5 * scaleX;
    // this.boundingBox['y'] = 1.0 * scaleY;

    // use a triangle intead of a line group
    this.geom.faces.push(new THREE.Face3(0, 2, 1));
    this.geom.computeFaceNormals();
    this.mat = new THREE.MeshBasicMaterial();
    // this.mat.color = new THREE.Color(255, 80, 20);
    // Note: the intensity doesn't really matter
    // It's basically binary and you only get "red meat" colors (r,b,g,y,p,b)
    this.mat.color = new THREE.Color(1, 1, 1);
    this.mesh = new THREE.Mesh(this.geom, this.mat);

    this.mesh.position.y = 0;
    this.mesh.position.z = 0;
    this.mesh.rotation.z = this.theta;
    let noseGeom = new THREE.PlaneGeometry(0.15,0.04);
    let noseMat= new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide});
    // let noseMat= new THREE.MeshBasicMaterial({ color: 0x0000FF, side: THREE.DoubleSide});

    this.nose = new THREE.Mesh(noseGeom, noseMat);

    this.mesh.add(this.nose);
  }

  // Come here when resetting a ship after a ship kill event
  reset() {
    this.mesh.position.x = 0;
    this.mesh.position.y = 0;
    this.mesh.position.z = 0;

    this.vx = 0.0;
    this.vy = 0.0;
  }

  rotate() {
  // rotate(dt?: number) {
    this.mesh.rotateZ(this.theta - this.thetaLast);

    this.thetaLast = this.theta;
  };

  // Note: this has been supplanted by utils.service.updatePos
  thrust(throttleFactor : number = 1.0) {
    this.vx += this.accelScalar * throttleFactor * Math.sin(this.theta);
    this.vy += this.accelScalar * throttleFactor * Math.cos(this.theta);

    // limit to max velocity
    if (this.vx > this.VX_MAX) {
      this.vx = this.VX_MAX;
    }
    else if (this.vx < -this.VX_MAX) {
      this.vx = -this.VX_MAX;
    }

    if (this.vy > this.VY_MAX) {
      this.vy = this.VY_MAX;
    }
    else if (this.vy < -this.VY_MAX) {
      this.vy = -this.VY_MAX;
    }
  };

  updatePos(dt? : number) {
    // this.utils.updatePos(this, this.base.projectionBoundary);
    this.utils.updatePos(this, this.base.projectionBoundary, dt);
  }

  collisionTest(point : THREE.Vector3) : boolean {
    let beenHit : boolean = false;

    let pointClone = point.clone();
    if( this.mesh.geometry.boundingSphere) {
      beenHit = this.mesh.geometry.boundingSphere.containsPoint(pointClone.sub(this.mesh.position));
    };

    return beenHit;
  };

  // test if the ship collides with the boundary of an asteroid
  asteroidCollisionTest(asteroid: Asteroid) : boolean {
    let shipCollided : boolean = false;

    // let pointClone = point.clone();
    if( this.mesh.geometry.boundingSphere) {
      // beenHit = this.mesh.geometry.boundingSphere.containsPoint(pointClone.sub(this.mesh.position));
      let shipBoundingSphere = this.mesh.geometry.boundingSphere.clone();
      let shipPos = this.mesh.position.clone();
      let asteroidBoundingBox = asteroid.mesh.geometry.boundingBox.clone();
      let asteroidPos = asteroid.mesh.position.clone();
      // shipBoundingSphere.translate(asteroidPos.multiplyScalar(1));
      // asteroidBoundingBox.translate(shipPos.multiplyScalar(-1));
      // asteroidBoundingBox.translate(asteroid.mesh.position);
      // shipCollided = shipBoundingSphere.intersectsBox(asteroidBoundingBox);
      // shipCollided = asteroidBoundingBox.distanceToPoint(shipPos) > shipBoundingSphere.radius ? true : false;
      // shipCollided = shipBoundingSphere.distanceToPoint(asteroidPos) > shipBoundingSphere.radius ? false : true;
      let distBetween = shipPos.distanceTo(asteroidPos);

      let asteroidSize = asteroidBoundingBox.getSize();

      if(distBetween < asteroidSize.x) {
        shipCollided = true;
      }
    };

    return shipCollided;
  };

  collisionHandler() {
    return true;
  }

  //getters and setters
  get base(): BaseService {
    return this._base;
  };
  get utils(): UtilsService {
    return this._utils;
  };

  public get VX_MAX() : number {
    return this._VX_MAX;
  }
  public set VX_MAX(v : number) {
    this._VX_MAX = v;
  }

  public get VY_MAX() : number {
    return this._VY_MAX;
  }
  public set VY_MAX(v : number) {
    this._VY_MAX = v;
  }

}
