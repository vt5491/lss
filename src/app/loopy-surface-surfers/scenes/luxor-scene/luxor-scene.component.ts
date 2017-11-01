///<reference path="../../../../../typings/index.d.ts" />
import { Component, OnInit, Injectable } from '@angular/core';
import { AsteroidsGame } from '../../../inner-games/asteroids/asteroids-game';
import { AsteroidsGameControllerListenerService } from '../../../inner-games/asteroids/aframe/asteroids-game-controller-listener.service';
import { InnerSceneRendererService } from '../../../services/aframe/inner-scene-renderer.service';
import { OuterSceneService } from '../../../services/outer-scene.service';
import { BaseService } from '../../../services/base.service';
import { UtilsService } from '../../../services/utils.service';
import { LssScene } from "../../../loopy-surface-surfers/components/lss-scene";

@Injectable()
@Component({
  selector: 'app-luxor-scene',
  templateUrl: './luxor-scene.component.html',
  styleUrls: ['./luxor-scene.component.css']
})
export class LuxorSceneComponent extends LssScene implements OnInit {
  sceneObj : THREE.Object3D;
  pyramid : THREE.Object3D;
  // private innerSceneRenderer: InnerSceneRendererService;

  constructor(
    public innerGame: AsteroidsGame, 
    private base : BaseService,
    private utils : UtilsService,
    public outerSceneSvc: OuterSceneService,
  ) {
    super(base, utils); 
    let luxorSceneComponent = this;
    // Note: the client that invokes this needs an updateScene method 
    // and an 'innerGame' instance variable (they will be called back and referred to)
    // this.innerSceneRenderer = new InnerSceneRendererService(this);
    // note : you really need to put in a scene load handler.  This doesnt
    // always work when done in the ctor.
    // note2: not true.  A component.init is only driven once a scene has loaded.
    // note3: you want to define the component before the scene loads.  You of course
    // want to run it once the scene has loaded
    AFRAME.registerComponent('luxor-scene-aframe-component', {
      init: () => {
        console.log(`LoopySurfaceSurfers.AFRAME.init: entered`);
      },
      tick: function (t, dt) {
        let a = 1;
      }
    });
  }

  ngOnInit() {
    this.projSceneComp = (document.querySelector('.proj-scene') as any).components['inner-scene-renderer'];
    this.innerSceneRenderer.init();
    this.outerSceneSvc.init();
  }

  doIt(){
    console.log(`LuxorSceneComponet.doIt: entered`);
  }

  initScene() {
    this.sceneObj = (document.querySelector('a-scene') as any).object3D;
    this.pyramid = this.sceneObj.getObjectByName('Pyramid');
    let pyramidMat = (this.pyramid as any).children[0].material;
    pyramidMat.side = THREE.DoubleSide;
    pyramidMat.needsUpdate = true;

    var fontLoader = new THREE.FontLoader();

    let img = document.querySelector('#vegas-vic-full');
    let vegasVicTexture = new THREE.TextureLoader().load( "../../../../assets/img/vegas_vic_full_no_wc.png" );
    vegasVicTexture.flipY = false;
    let vicHeadTexture = new THREE.TextureLoader().load( "../../../../assets/img/vic_head_texture.jpg" );
    vicHeadTexture.flipY = false;
    let vegasVicStraightOnTexture = new THREE.TextureLoader().load( "../../../../assets/img/vic_shirt.png" );
    vegasVicStraightOnTexture.flipY = false;
    let vicLegsTexture = new THREE.TextureLoader().load( "../../../../assets/img/vic_legs.png" );
    vicLegsTexture.flipY = false;
    let vicArmTexture = new THREE.TextureLoader().load( "../../../../assets/img/vic_arm_black.png" );
    vicArmTexture.flipY = false;

    let sceneObj = (document.querySelector('a-scene') as any).object3D;

    //Ground
    let ground = sceneObj.getObjectByName('Ground');
    let groundMat = (ground as any).children[0].material;
    groundMat.map = vegasVicTexture;
    groundMat.needsUpdate = true;

    // Arm
    let armMesh = sceneObj.getObjectByName('Arm');
    let armMat = armMesh.children[0].material;
    armMat.map = vegasVicTexture;
    armMat.needsUpdate = true;

    // Face
    let faceMesh = sceneObj.getObjectByName('Face');
    let faceMat = faceMesh.children[0].material;
    faceMat.side = THREE.DoubleSide;
    faceMat.map = vicHeadTexture;
    faceMat.needsUpdate = true;

    // Shirt
    let shirtMesh = sceneObj.getObjectByName('Shirt');
    let shirtMat = shirtMesh.children[0].material;
    shirtMat.map = vegasVicTexture;
    shirtMat.needsUpdate = true;

    // Legs
    let legsMesh = sceneObj.getObjectByName('Legs');
    let legsMat = legsMesh.children[0].material;
    legsMat.map = vegasVicTexture;
    legsMat.needsUpdate = true;

    let loader = new THREE.TextureLoader();
    loader.load( "../../../../assets/img/welcome_to_las_vegas.jpg", (welcomeToLasVegasTexture) => {
      welcomeToLasVegasTexture.flipY = false;

      let objects : string[] = [];
      objects.push('CircleW', 'CircleE1', 'CircleL', 'CircleC', 'CircleO', 'CircleM', 'CircleE2', 'MainBoard', 'Pyramid');

      for(let i=0; i < objects.length; i++ ) {
        let o = objects[i];
        let mesh = sceneObj.getObjectByName(o);
        let meshMat = mesh.children[0].material;
        meshMat.map = welcomeToLasVegasTexture;
        meshMat.needsUpdate = true;
      }
    });
  }

  animateTowerSides() {

  }

  getProjectionMesh() : THREE.Mesh {
    let projectionMesh = null;

    if ((document.querySelector('#luxor-model') as any).object3D.getObjectByName('Cube')) {
      projectionMesh = (document.querySelector('#luxor-model') as any).object3D.getObjectByName('Cube'); 
    }

    return projectionMesh;
  }

  // this is the base texture that will be wrapped around the projection Mesh, onto
  // which the inner game will also be projected.
  getBaseTexture() : THREE.Texture {
    // return new THREE.TextureLoader().load( "../../../../assets/img/two_ball.jpg" );  
    return new THREE.TextureLoader().load( "../../../../assets/img/coke-label.jpg" );  
  }

  trackDolly (pos : THREE.Vector3 ) {
    this.outerSceneSvc.dolly.position.x = pos.x;
    this.outerSceneSvc.dolly.position.y = pos.y;
  }

}
