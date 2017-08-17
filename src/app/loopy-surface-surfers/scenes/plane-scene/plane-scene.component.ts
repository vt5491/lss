import { Component, OnInit } from '@angular/core';
import { AsteroidsGame } from '../../../inner-games/asteroids/asteroids-game'
import { InnerSceneRendererService } from '../../../services/aframe/inner-scene-renderer.service';

@Component({
  selector: 'app-plane-scene',
  templateUrl: './plane-scene.component.html',
  styleUrls: ['./plane-scene.component.css']
})
export class PlaneSceneComponent implements OnInit {
  private innerSceneRenderer: InnerSceneRendererService;

  constructor(public innerGame: AsteroidsGame) { 
    // Note: the client that invokes this needs
    // an 'innerGame' instance variable with an updateScene method (they will be called back and referred to)
    // more accurately, the component that instantiates InnerSceneRender 
    // e.g this module (plane-scene.component in this case) must have
    // an innerScene object, and that innerScene object must have an 'udateScene'
    // method (unless it's a static scene, in which case it doesn't need 'updatScene')
    this.innerSceneRenderer = new InnerSceneRendererService(this);

  }

  ngOnInit() {
  }

  getProjectionMesh() : THREE.Mesh {
    let projectionMesh = null;

    if (document.querySelector('#test-plane')) {
      projectionMesh = (document.querySelector('#test-plane') as any).object3D.children[0];
    }

    return projectionMesh;
  }

}
