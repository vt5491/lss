import { Injectable } from '@angular/core';

@Injectable()
export class BaseService {

  static ONE_DEG = Math.PI / 180.0;
  //TODO: projectionBoundary and _boundVal are the same idea.  Decide which
  // one to go with and get rid of the other (probably keep projectionBoundary)
  projectionBoundary : number;
  innerImgDim : number;
  private _boundVal : number;
  CAMERA_MOVE_DELTA : number = 1.2;
  CAMERA_ROT_DELTA : number = 5;

  constructor() {
    this.init();
  }

  init() {
    //TODO: magic number dependency.  It's actualy proportional to physical screen size?
    // this.projectionBoundary = 3.79;
    this.projectionBoundary = 3.81; //the best with camera.position= 5.0
    // this.projectionBoundary = 3.75; //2017-08-24
    // this.projectionBoundary = 1.0;
    // this.projectionBoundary = 0.5;
    // console.log(`BaseService.init: projectionBoundary=${this.projectionBoundary}`);
    this.innerImgDim = 1400;
    // this.innerImgDim = 2000;
  };

  //getters and setters
  get ONE_DEG(): number {
    return BaseService.ONE_DEG;
  }

  public get boundVal() : number {
    return this._boundVal;
  }
  public set boundVal(v : number) {
    this._boundVal = v;
  }

}
