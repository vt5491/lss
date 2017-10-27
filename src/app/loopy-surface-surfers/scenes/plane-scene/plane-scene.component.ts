import { Component, OnInit } from '@angular/core';
import { AsteroidsGame } from '../../../inner-games/asteroids/asteroids-game';
import { InnerSceneRendererService } from '../../../services/aframe/inner-scene-renderer.service';
import { OuterSceneService } from '../../../services/outer-scene.service';
import { BaseService } from '../../../services/base.service';
import { UtilsService } from '../../../services/utils.service';
import { LssScene } from "../../../loopy-surface-surfers/components/lss-scene";

@Component({
  selector: 'app-plane-scene',
  templateUrl: './plane-scene.component.html',
  styleUrls: ['./plane-scene.component.css']
})
export class PlaneSceneComponent extends LssScene implements OnInit {
  // private innerSceneRenderer: InnerSceneRendererService;

  constructor(
    public innerGame: AsteroidsGame, 
    public outerSceneSvc: OuterSceneService,
    private base : BaseService,
    private utils: UtilsService
  ) {
    super(base, utils); 
    // console.log(`PlaneSceneComponent.ctor: base.dollyTrackDefault=${base.dollyTrackDefault}`);
    // Note: the client that invokes this needs
    // an 'innerGame' instance variable with an updateScene method (they will be called back and referred to)
    // more accurately, the component that instantiates InnerSceneRender 
    // e.g this module (plane-scene.component in this case) must have
    // an innerScene object, and that innerScene object must have an 'updateScene'
    // method (unless it's a static scene, in which case it doesn't need 'updatScene')
    // this.innerSceneRenderer = new InnerSceneRendererService(this);
  }

  doSomething() {
    return 7;
  }

  ngOnInit() {
    this.projSceneComp = (document.querySelector('.proj-scene') as any).components['inner-scene-renderer'];
    this.outerSceneSvc.init();
    // console.log('PlaneSceneComponent: about to auto-enter vr');
    // debugger;
    // (document.querySelector('a-scene') as any).enterVR()
    // let sceneEl = document.querySelector('a-scene');
    // sceneEl.addEventListener('renderstart', () => {
    //   console.log('rendering started');
    //   setTimeout(function(){ (document.querySelector('a-scene') as any).enterVR() }, 3000);
    // })
  }

  getProjectionMesh() : THREE.Mesh {
    let projectionMesh = null;

    if (document.querySelector('#test-plane')) {
      projectionMesh = (document.querySelector('#test-plane') as any).object3D.children[0];
    }

    // debugger;
    return projectionMesh;
  }

  // this is the base texture that will be wrapped around the projection Mesh, onto
  // which the inner game will also be projected.
  getBaseTexture() : THREE.Texture {
    // return new THREE.TextureLoader().load( "../../../../assets/img/two_ball.jpg" );  
    // return new THREE.TextureLoader().load("../../../../assets/img/coke-label.jpg");  
    // return new THREE.TextureLoader().load("../../../../assets/img/notebook-paper.png");  
    // return new THREE.TextureLoader().load("../../../../assets/img/yellow-notebook-paper.png");  
    return new THREE.TextureLoader().load("../../../../assets/img/yellow-notebook-paper-binary.png");  
  }

  trackDolly (pos : THREE.Vector3 ) {
    this.outerSceneSvc.dolly.position.x = pos.x;
    this.outerSceneSvc.dolly.position.y = pos.y;
  }
}
