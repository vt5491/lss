import { Component, OnInit, Injectable } from '@angular/core';
import { AsteroidsGame } from '../../inner-games/asteroids/asteroids-game';
import { InnerSceneRendererService } from '../../services/aframe/inner-scene-renderer.service';
import { OuterSceneService } from '../../services/outer-scene.service';
import { BaseService } from '../../services/base.service';
import { UtilsService } from '../../services/utils.service';
import { AutoEnterVrService } from '../../services/aframe/auto-enter-vr.service';

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

  constructor(
    // Note: Do not include scope qualifers on these ("public", "private" et al.)
    // Angular doesn't allow dependecy injection on common parms in base and child classes.
    // innerGame: AsteroidsGame, 
    // outerSceneSvc: OuterSceneService,
    base : BaseService,
    utils : UtilsService
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

    // initialize the AutoEnterVr component so we can tag <scene> with this attribute
    let autoEnterVr =  new AutoEnterVrService(utils);
  }

  init() {};
}
