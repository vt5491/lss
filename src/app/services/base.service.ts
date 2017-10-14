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
  // docLSS : Object;

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
    // this was the default for a long time
    // this.innerImgDim = 1400;
    // 2048 really bogs out over 1400: chrome (60fps->45), ff(90fps -> 60)
    // this.innerImgDim = 2048;
    // 1024 zips up over 1400 on chrome, but not as big a diff on ff.
    this.innerImgDim = 1024;
    // this.innerImgDim = 2000;
    // 512..not much improvment over 1024, and the jaggies are really bad.  still
    // playable, so could go to in a pinch.
    // this.innerImgDim = 512;
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

  public get docLSS() : Object {
    if (!(document as any).LSS) {
      (document as any).LSS = {};
    }

    return (document as any).LSS;
  }
}
