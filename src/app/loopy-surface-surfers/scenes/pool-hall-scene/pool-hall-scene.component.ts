import { Component, OnInit, Injectable } from '@angular/core';
import { AsteroidsGame } from '../../../inner-games/asteroids/asteroids-game';
import { InnerSceneRendererService } from '../../../services/aframe/inner-scene-renderer.service';
import { OuterSceneService } from '../../../services/outer-scene.service';
import { BaseService } from '../../../services/base.service';

@Injectable()
@Component({
  selector: 'app-pool-hall-scene',
  templateUrl: './pool-hall-scene.component.html',
  styleUrls: ['./pool-hall-scene.component.css']
})
export class PoolHallSceneComponent implements OnInit {
  private innerSceneRenderer: InnerSceneRendererService;  
  // private projSphere = {};
  // private dollyRadius : number; // the distance the dolly is from the proj-obj

  constructor(public innerGame: AsteroidsGame, 
    public outerSceneSvc: OuterSceneService,
    private base : BaseService
  ) { 
    // console.log('PoolHallSceneComponent: now in ctor');
    // this.projSphere['pos'] = new THREE.Vector3();

    this.innerSceneRenderer = new InnerSceneRendererService(this);
  }

  ngOnInit() {
    this.outerSceneSvc.init();

    this.initScene();
  }

  initScene() {
    let projObjX = this.outerSceneSvc.projObj.position.x;
    let projObjY = this.outerSceneSvc.projObj.position.y;
    let projObjZ = this.outerSceneSvc.projObj.position.z;

    // recenter the camera to the proj-obj
    this.outerSceneSvc.dolly.position.x += projObjX; 
    this.outerSceneSvc.dolly.position.y += projObjY; 
    this.outerSceneSvc.dolly.position.z += projObjZ; 


    let quat = new THREE.Quaternion();
    quat.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );

    this.outerSceneSvc.dolly.lookAt(new THREE.Vector3(projObjX, projObjY, projObjZ));

    this.outerSceneSvc.dolly.rotation.setFromQuaternion(quat);

    let axisHelper = new THREE.AxisHelper(10);
    this.outerSceneSvc.projScene.add(axisHelper);
  };

  // initOuterScene() {
  //   console.log('PoolHallSceneComponent.initOuterScene: entered');
  //   // this.outerScene

  // }

  // getProjectionMesh() : THREE.Mesh {
  //   let projectionMesh = null;

  //   if ((document.querySelector('#pool-hall-model') as any).object3D.getObjectByName('PoolBall')) {
  //     projectionMesh = (document.querySelector('#pool-hall-model') as any)
  //       .object3D
  //       // .getObjectByName('PoolBall')
  //       .getObjectByName('PoolBall_002')
  //       .children[0]; 
  //   }

  //   return projectionMesh;
  // }

  getProjectionMesh() : THREE.Mesh {
    let projectionMesh = null;

    if (document.querySelector('#aframe-sphere')) {
      projectionMesh = (document.querySelector('#aframe-sphere') as any).object3D.children[0];
    }

    return projectionMesh;
  }

  // this is the base texture that will be wrapped around the projection Mesh, onto
  // which the inner game will also be projected.
  getBaseTexture() : THREE.Texture {
    return new THREE.TextureLoader().load( "../../../../assets/img/two_ball.jpg" );  
    // return new THREE.TextureLoader().load( "../../../../assets/img/coke-label.jpg" );  
  }
  
  trackDolly (pos : THREE.Vector3 ) {
    // this.outerGameService.dolly.position.x = pos.x;
    // this.outerGameService.dolly.position.y = pos.y;
    // let dollyDelta = this.outerSceneSvc.dolly.position.clone();
    let projObjX = this.outerSceneSvc.projObj.position.x;
    let projObjY = this.outerSceneSvc.projObj.position.y;
    let projObjZ = this.outerSceneSvc.projObj.position.z;

    let dollyRadius = this.outerSceneSvc.dolly.position.distanceTo(this.outerSceneSvc.projObj.position);
    // let dollyRadius = Math.sqrt(projObjX ^ 2 + projObjY ^2 + projObjZ ^ 2);
    // dollyRadius = 10;

    let phi = (pos.y / this.base.projectionBoundary) * Math.PI;
    phi /= 2.0;
    console.log(`trackDolly: phi=${phi}, dollyRadius=${dollyRadius},projObjY=${projObjY},projObjZ=${projObjZ}`);
    
    this.outerSceneSvc.dolly.position.x = projObjX + dollyRadius * Math.cos(phi); 
    this.outerSceneSvc.dolly.position.y = projObjY + dollyRadius * Math.sin(phi); 
    // this.outerSceneSvc.dolly.position.z = projObjZ + dollyRadius * Math.cos(phi); 
    let dollyX= this.outerSceneSvc.dolly.position.x;
    let dollyY= this.outerSceneSvc.dolly.position.y;
    let dollyZ= this.outerSceneSvc.dolly.position.z;
    console.log(`trackDolly: dolly.x=${dollyX},dolly.y=${dollyY}, dolly.z=${dollyZ}`);

    let quat1 = new THREE.Quaternion();
    quat1.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );
    // this.outerSceneSvc.dolly.rotation.setFromQuaternion(quat);

    let quat2 = new THREE.Quaternion();
    quat2.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ),  phi );
    quat2.multiply(quat1);
    // this.outerSceneSvc.dolly.lookAt(new THREE.Vector3(projObjX, projObjY, projObjZ));
    this.outerSceneSvc.dolly.rotation.setFromQuaternion(quat2);
    
  }

}
