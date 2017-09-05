import { Component, OnInit, Injectable } from '@angular/core';
import { AsteroidsGame } from '../../../inner-games/asteroids/asteroids-game';
import { InnerSceneRendererService } from '../../../services/aframe/inner-scene-renderer.service';
import { OuterSceneService } from '../../../services/outer-scene.service';
import { BaseService } from '../../../services/base.service';
import { UtilsService } from '../../../services/utils.service';
// import { LssScene } from "../../../interfaces/lss-scene";
import { LssScene } from "../../../loopy-surface-surfers/components/lss-scene";

@Injectable()
@Component({
  selector: 'app-globe-scene',
  templateUrl: './globe-scene.component.html',
  styleUrls: ['./globe-scene.component.css']
})
export class GlobeSceneComponent extends LssScene implements OnInit {
  // private innerSceneRenderer: InnerSceneRendererService;  

  constructor(
    private innerGame : AsteroidsGame,
    private outerSceneSvc : OuterSceneService,
    private base : BaseService,
    private utils : UtilsService
  ) { 
    super(base);
    // super(innerGame, outerSceneSvc, base);
    this.dollyRadius = 10.0
    // this.innerSceneRenderer = new InnerSceneRendererService(this);

  }

  ngOnInit() {
    this.outerSceneSvc.init();
  }

  getProjectionMesh() : THREE.Mesh {
    let projectionMesh = null;

    if (document.querySelector('#aframe-globe')) {
      projectionMesh = (document.querySelector('#aframe-globe') as any).object3D.children[0];
    }

    return projectionMesh;
  }

  getBaseTexture() : THREE.Texture {
    return new THREE.TextureLoader().load( "../../../../assets/img/world_satellite_2.png" );  
  }

  trackDolly (pos : THREE.Vector3){
    return this.utils.trackDollySpherical(pos, this);
  }

}
