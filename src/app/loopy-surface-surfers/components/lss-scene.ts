import { Component, OnInit, Injectable, Injector } from '@angular/core';
import { AsteroidsGame } from '../../inner-games/asteroids/asteroids-game';
import { InnerSceneRendererService } from '../../services/aframe/inner-scene-renderer.service';
import { OuterSceneService } from '../../services/outer-scene.service';
import { BaseService } from '../../services/base.service';
import { UtilsService } from '../../services/utils.service';
import { ShipThrustSoundService } from '../../services/aframe/ship-thrust-sound.service';

export class LssScene {
  protected innerSceneRenderer: InnerSceneRendererService;
  protected innerSceneScrollQuanta : number;
  protected lastPhi : number;
  protected lastTheta : number;
  protected lastLongitude : number;
  protected lastLatitude : number;
  protected dollyRotX : THREE.Matrix4;
  protected dollyRotY : THREE.Matrix4;
  protected dollyTranslation : THREE.Matrix4;
  protected dollyTransform : THREE.Matrix4;
  protected dollyRadius: number;
  protected projSceneComp: AFrame.Component;
  private injector: Injector;
  protected baseTexture : THREE.Texture;

  constructor(
    // Note: Do not include scope qualifers on these ("public", "private" et al.)
    // Angular doesn't allow dependecy injection on common parms in base and child classes.
    base : BaseService,
    utils : UtilsService,
  ) {
    console.log('LssScene.ctor: entered');

    this.innerSceneRenderer = new InnerSceneRendererService(this);
    this.innerSceneScrollQuanta = base.ONE_DEG * 30.0;
    this.lastPhi = 0.0;
    this.lastTheta = 0.0;
    this.lastLatitude = 0.0;
    this.lastLongitude = 0.0;

    this.dollyRotX = new THREE.Matrix4();
    this.dollyRotY = new THREE.Matrix4();
    this.dollyTranslation = new THREE.Matrix4();
    this.dollyTransform = new THREE.Matrix4();
    this.dollyRadius = 10.0;

    let shipThrustSound =  new ShipThrustSoundService(utils, base);
  }

  init() {
    // refer to the 'inner-scene-component' attribute (component) so the
    // inner-scene-renderer has access to itself, since most of the
    // inner-scene-renderer component is bound to e.g
    // 'coke-can-scene.component.ts'
    this.projSceneComp = (document.querySelector('.proj-scene') as any).components['inner-scene-renderer'];
  };
}
