///<reference path="../../../../typings/index.d.ts" />
import { Injectable, Injector } from '@angular/core';
import { IMoveableGameObject } from "../../interfaces/imoveable-game-object";
import { BaseService } from '../../services/base.service';
import { UtilsService } from '../../services/utils.service';

@Injectable()
export class Asteroid implements IMoveableGameObject {

  tag : string;
  three_id : number;
  x  : number;
  vx : number;
  vy : number;
  _width: number;
  height: number;
  DEFAULT_WIDTH = 0.2;
  DEFAULT_HEIGHT = 0.4;
  // make the asteroid smaller by this amount as it progresses through its lifecycle
  LIFECYLE_SCALE_FACTOR = 0.67;
  geom : THREE.PlaneBufferGeometry;
  mat : THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
  vScalar: number = 0.004;
  bBox : THREE.Box3;
  lifeCycleStage: number;

  constructor (
    private _base : BaseService,
    private _utils : UtilsService,
    private _parms : Object
  ) {
    this.x = 0.0;
    this.vx = 0.003;
    this.vy = 0;

    this.init();
  };

  init() {
    this.width = this.parms['width'] || this.DEFAULT_WIDTH;
    this.height = this.parms['height'] || this.DEFAULT_HEIGHT;

    this.tag = 'asteroid';
    this.geom = new THREE.PlaneBufferGeometry(this.width, this.height);
    this.geom.computeBoundingBox();
    this.mat = new THREE.MeshBasicMaterial({ color: 0xF0FF20, side: THREE.DoubleSide });

    this.mesh = new THREE.Mesh(this.geom, this.mat);
    this.mesh.position.x = 0.0;
    this.mesh.position.z = 0.0;

    // it's important that all the x,y,z positions be set to zero for bBox to work properly
    // redundant to geom.boundingBox?
    this.bBox = new THREE.Box3().setFromObject(this.mesh);

    this.lifeCycleStage = 0;
  };

  updatePos(dt? : number) {
    this.utils.updatePos(this, this.base.projectionBoundary, dt);
  };

  // returns true or false depending if the point is inside the asteroid's bounding box.
  collisionTest(point : THREE.Vector3) : boolean {
    let beenHit : boolean = false;

    // since manipulate the point during testing, make a clone so we don't affect
    // the parent object of point.
    let pointClone = point.clone();
    beenHit = this.mesh.geometry.boundingBox.containsPoint(pointClone.sub(this.mesh.position));

    return beenHit;
  }

  collisionHandler() {
    let result = [];
    if (this.lifeCycleStage < 2) {
      let vx = this.vx;
      let vy = this.vy;
      let posX = this.mesh.position.x;
      let posY = this.mesh.position.y;
      let posZ = this.mesh.position.z;
      let lastLifeCycleStage = this.lifeCycleStage;

      let splitAst1 = new Asteroid(
        this.base,
        this.utils,
        {width : this.width * this.LIFECYLE_SCALE_FACTOR, height : this.height * this.LIFECYLE_SCALE_FACTOR}
      );

      splitAst1.mesh.position.x = this.mesh.position.x;
      splitAst1.mesh.position.y = this.mesh.position.y;
      splitAst1.mesh.position.z = this.mesh.position.z;

      splitAst1.vx =  -this.vx;
      splitAst1.vy =  this.vy;

      splitAst1.three_id = splitAst1.mesh.id;
      splitAst1.lifeCycleStage = lastLifeCycleStage + 1;

      let splitAst2 = new Asteroid(
        this.base,
        this.utils,
        {width : this.width * this.LIFECYLE_SCALE_FACTOR, height : this.height * this.LIFECYLE_SCALE_FACTOR}
      );

      splitAst2.mesh.position.x = this.mesh.position.x;
      splitAst2.mesh.position.y = this.mesh.position.y;
      splitAst2.mesh.position.z = this.mesh.position.z;

      splitAst2.vx =  this.vx;
      splitAst2.vy = -this.vy;

      splitAst2.three_id = splitAst2.mesh.id;
      splitAst2.lifeCycleStage = lastLifeCycleStage + 1;
      result = [splitAst1, splitAst2];
    }

    return result;
  }

  //getters and setters
  get base(): BaseService {
    return this._base;
  };

  get utils(): UtilsService {
    return this._utils;
  };

  get parms(): Object {
    return this._parms;
  };

  get width(): number {
    return this._width;
  };
  set width(w : number) {
    this._width = w;
  };

  // return the number of "hit points" for hitting this asteroid
  get hitValue() : number {
    let hitValue = 0;

    switch (this.lifeCycleStage) {
      case 0 :
        hitValue = 10;
      break;
      case 1 :
        hitValue = 20;
      break;
      case 2 :
        hitValue = 40;
      break;
    }

    return hitValue;
  }
}
