import { Component, OnInit } from '@angular/core';
import { AsteroidsGame } from '../../../inner-games/asteroids/asteroids-game';
import { InnerSceneRendererService } from '../../../services/aframe/inner-scene-renderer.service';
import { OuterGameService } from '../../../services/outer-game.service';

@Component({
  selector: 'app-plane-scene',
  templateUrl: './plane-scene.component.html',
  styleUrls: ['./plane-scene.component.css']
})
export class PlaneSceneComponent implements OnInit {
  private innerSceneRenderer: InnerSceneRendererService;
  // private outerGameService : OuterGameService;

  constructor(public innerGame: AsteroidsGame, public outerGameService: OuterGameService) { 
    // this.outerGameService = new OuterGameService();
    // Note: the client that invokes this needs
    // an 'innerGame' instance variable with an updateScene method (they will be called back and referred to)
    // more accurately, the component that instantiates InnerSceneRender 
    // e.g this module (plane-scene.component in this case) must have
    // an innerScene object, and that innerScene object must have an 'updateScene'
    // method (unless it's a static scene, in which case it doesn't need 'updatScene')
    this.innerSceneRenderer = new InnerSceneRendererService(this);

  }

  ngOnInit() {
    console.log('PlaneSceneComponent: now in ngOnInit');
    this.outerGameService.init();
    
  }

  getProjectionMesh() : THREE.Mesh {
    let projectionMesh = null;

    if (document.querySelector('#test-plane')) {
      projectionMesh = (document.querySelector('#test-plane') as any).object3D.children[0];
    }

    return projectionMesh;
  }

  // this is the base texture that will be wrapped around the projection Mesh, onto
  // which the inner game will also be projected.
  getBaseTexture() : THREE.Texture {
    // return new THREE.TextureLoader().load( "../../../../assets/img/two_ball.jpg" );  
    return new THREE.TextureLoader().load("../../../../assets/img/coke-label.jpg");  
  }

  trackDolly (pos : THREE.Vector3 ) {
    this.outerGameService.dolly.position.x = pos.x;
    this.outerGameService.dolly.position.y = pos.y;
  }

  // onInnerSceneTick( e: Event)  {
  //   console.log('PlaneSceneComponent.onInnerSceneTick: hello');
  // }

}
