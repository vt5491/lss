import { Component, OnInit, Injectable } from '@angular/core';
import { AsteroidsGame } from '../../../inner-games/asteroids/asteroids-game';
import { InnerSceneRendererService } from '../../../services/aframe/inner-scene-renderer.service';
import { OuterSceneService } from '../../../services/outer-scene.service';
import { BaseService } from '../../../services/base.service';
import { UtilsService } from '../../../services/utils.service';
import { LssScene } from "../../../loopy-surface-surfers/components/lss-scene";

@Injectable()
@Component({
  selector: 'app-pool-hall-scene',
  templateUrl: './pool-hall-scene.component.html',
  styleUrls: ['./pool-hall-scene.component.css']
})
export class PoolHallSceneComponent extends LssScene implements OnInit {

  constructor(
    // note: you cannot dependencty inject at the base class level:
    // see https://stackoverflow.com/questions/40800657/injecting-angular2-service-into-components-base-class
    // thus we have to do it here.
    private innerGame: AsteroidsGame,
    private outerSceneSvc: OuterSceneService,
    private base : BaseService,
    private utils: UtilsService
  ) {
    // super(innerGame, outerSceneSvc, base);
    super(base, utils);
    this.dollyRadius = 5.0;
    this.baseTexture = new THREE.TextureLoader().load( "../../../../assets/img/two_ball.jpg" );
  }

  ngOnInit() {
    this.projSceneComp = (document.querySelector('.proj-scene') as any).components['inner-scene-renderer'];
    this.innerSceneRenderer.init();
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
    return this.baseTexture;
  }

  trackDolly (pos : THREE.Vector3 ) {
    let longitude = (pos.x / this.base.projectionBoundary) * Math.PI + 1 * Math.PI / 2;
    let latitude = (pos.y / this.base.projectionBoundary) * Math.PI + 0 * Math.PI /2;
    latitude /= 2.0;
    let radius = 5.0

    if (this.outerSceneSvc.discreteInnerSceneScroll) {
      this.dollyRotX.makeRotationX(-this.lastLatitude);
      if (Math.abs(latitude - this.lastLatitude) > this.innerSceneScrollQuanta) {
        // console.log(`PoolHallScene: latitude=${latitude}, lastLatitude=${this.lastLatitude}`);

        if (latitude > this.lastLatitude) {
          this.dollyRotX.makeRotationX(-1 * latitude);
          this.lastLatitude = this.lastLatitude + this.innerSceneScrollQuanta / 1;
        }
        else {
          this.dollyRotX.makeRotationX(-1 * latitude);
          this.lastLatitude = this.lastLatitude - this.innerSceneScrollQuanta;
        }
      }
    }
    else {
      this.dollyRotX.makeRotationX(-latitude);
    }

    if (this.outerSceneSvc.discreteInnerSceneScroll) {
      this.dollyRotY.makeRotationY(this.lastLongitude);
      if (Math.abs(longitude - this.lastLongitude) > this.innerSceneScrollQuanta) {
        if (longitude > this.lastLongitude) {
          this.dollyRotY.makeRotationX(longitude);
          this.lastLongitude = this.lastLongitude + this.innerSceneScrollQuanta;
        }
        else {
          this.dollyRotY.makeRotationX(longitude);
          this.lastLongitude = this.lastLongitude - this.innerSceneScrollQuanta;
        }
      }
    }
    else {
      this.dollyRotY.makeRotationY(longitude);
    }

    this.dollyTranslation.makeTranslation(0, 0, radius);
    // Note: the order of mults is important on the following line
    this.dollyTransform = this.dollyRotY.multiply(this.dollyRotX);
    this.dollyTransform.multiply(this.dollyTranslation);

    this.outerSceneSvc.dolly.matrix.identity();
    this.outerSceneSvc.dolly.applyMatrix(this.dollyTransform);
  }

  trackDollyOld (pos : THREE.Vector3 ) {
    let projObjX = this.outerSceneSvc.projObj.position.x;
    let projObjY = this.outerSceneSvc.projObj.position.y;
    let projObjZ = this.outerSceneSvc.projObj.position.z;

    let dollyRadius = this.outerSceneSvc.dolly.position.distanceTo(this.outerSceneSvc.projObj.position);
    dollyRadius = 5;

    // up and down (vertical) scrolling
    let phi = (pos.y / this.base.projectionBoundary) * Math.PI;
    phi /= 2.0;
    if (Math.abs(phi - this.lastPhi) > this.innerSceneScrollQuanta) {
      if (phi > this.lastPhi) {
        this.lastPhi = this.lastPhi + this.innerSceneScrollQuanta;
      }
      else{
        this.lastPhi = this.lastPhi - this.innerSceneScrollQuanta;
      }

      this.outerSceneSvc.dolly.position.x = projObjX + dollyRadius * Math.cos(phi);
      this.outerSceneSvc.dolly.position.y = projObjY + dollyRadius * Math.sin(phi);
      // this.outerSceneSvc.dolly.position.z = projObjZ + dollyRadius * Math.cos(phi);
      let dollyX = this.outerSceneSvc.dolly.position.x;
      let dollyY = this.outerSceneSvc.dolly.position.y;
      let dollyZ = this.outerSceneSvc.dolly.position.z;
      // console.log(`trackDolly: dolly.x=${dollyX},dolly.y=${dollyY}, dolly.z=${dollyZ}`);

      let quat1 = new THREE.Quaternion();
      quat1.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
      // this.outerSceneSvc.dolly.rotation.setFromQuaternion(quat);

      let quat2 = new THREE.Quaternion();
      quat2.setFromAxisAngle(new THREE.Vector3(0, 0, 1), phi);
      quat2.multiply(quat1);
      // this.outerSceneSvc.dolly.lookAt(new THREE.Vector3(projObjX, projObjY, projObjZ));
      this.outerSceneSvc.dolly.rotation.setFromQuaternion(quat2);
    }

    // left and right (horizontal) scrolling
    let theta = (pos.x / this.base.projectionBoundary) * Math.PI + 0 * Math.PI / 2;
    theta /= 1.0;
    theta *= -1;
    theta -= Math.PI / 2;
    if (Math.abs(theta - this.lastTheta) > this.innerSceneScrollQuanta) {
      if (theta > this.lastTheta) {
        this.lastTheta = this.lastTheta + this.innerSceneScrollQuanta;
      }
      else{
        this.lastTheta = this.lastTheta - this.innerSceneScrollQuanta;
      }

      this.outerSceneSvc.dolly.position.x = projObjX - dollyRadius * Math.sin(theta + 0 * Math.PI / 2.0);
      this.outerSceneSvc.dolly.position.z = projObjZ + dollyRadius * Math.cos(theta + 0 * Math.PI / 2.0);

      let quat1 = new THREE.Quaternion();
      quat1.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0 * Math.PI / 2);

      let quat2 = new THREE.Quaternion();
      quat2.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -1 * theta + 0 *Math.PI / 2.0);
      quat2.multiply(quat1);
      // this.outerSceneSvc.dolly.lookAt(new THREE.Vector3(projObjX, projObjY, projObjZ));
      this.outerSceneSvc.dolly.rotation.setFromQuaternion(quat2);
    }

  }

}
