import { Component, OnInit, Injectable } from '@angular/core';
import { AsteroidsGame } from '../../../inner-games/asteroids/asteroids-game';
import { InnerSceneRendererService } from '../../../services/aframe/inner-scene-renderer.service';
import { OuterGameService } from '../../../services/outer-game.service';

@Injectable()
@Component({
  selector: 'app-pool-hall-scene',
  templateUrl: './pool-hall-scene.component.html',
  styleUrls: ['./pool-hall-scene.component.css']
})
export class PoolHallSceneComponent implements OnInit {
  private innerSceneRenderer: InnerSceneRendererService;  

  constructor(public innerGame: AsteroidsGame, public outerGameService: OuterGameService) { 
    console.log('PoolHallSceneComponent: now in ctor');

    this.innerSceneRenderer = new InnerSceneRendererService(this);
  }

  ngOnInit() {
    this.outerGameService.init();
  }

  initScene() {
    console.log('PoolHallSceneComponent.initScene: entered');

  }

  getProjectionMesh() : THREE.Mesh {
    let projectionMesh = null;

    if ((document.querySelector('#pool-hall-model') as any).object3D.getObjectByName('PoolBall')) {
      projectionMesh = (document.querySelector('#pool-hall-model') as any)
        .object3D
        // .getObjectByName('PoolBall')
        .getObjectByName('PoolBall_002')
        .children[0]; 
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
    this.outerGameService.dolly.position.x = pos.x;
    this.outerGameService.dolly.position.y = pos.y;
  }

}
