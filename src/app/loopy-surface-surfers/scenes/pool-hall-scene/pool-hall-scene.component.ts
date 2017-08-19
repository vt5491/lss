import { Component, OnInit, Injectable } from '@angular/core';
import { AsteroidsGame } from '../../../inner-games/asteroids/asteroids-game';
import { InnerSceneRendererService } from '../../../services/aframe/inner-scene-renderer.service';

@Injectable()
@Component({
  selector: 'app-pool-hall-scene',
  templateUrl: './pool-hall-scene.component.html',
  styleUrls: ['./pool-hall-scene.component.css']
})
export class PoolHallSceneComponent implements OnInit {
  private innerSceneRenderer: InnerSceneRendererService;  

  constructor(public innerGame: AsteroidsGame) { 
    console.log('PoolHallSceneComponent: now in ctor');

    this.innerSceneRenderer = new InnerSceneRendererService(this);
  }

  ngOnInit() {
  }

  initScene() {
    console.log('PoolHallSceneComponent.initScene: entered');

  }

  getProjectionMesh() : THREE.Mesh {
    let projectionMesh = null;

    if ((document.querySelector('#pool-hall-model') as any).object3D.getObjectByName('PoolBall')) {
      projectionMesh = (document.querySelector('#pool-hall-model') as any)
        .object3D
        .getObjectByName('PoolBall')
        .children[0]; 
    }

    return projectionMesh;
  }

}
