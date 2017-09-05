import { Component, OnInit, Injectable } from '@angular/core';
import { AsteroidsGame } from '../../../inner-games/asteroids/asteroids-game';
import { InnerSceneRendererService } from '../../../services/aframe/inner-scene-renderer.service';
import { OuterSceneService } from '../../../services/outer-scene.service';
import { BaseService } from '../../../services/base.service';
import { UtilsService } from '../../../services/utils.service';
import { LssScene } from "../../../loopy-surface-surfers/components/lss-scene";

@Injectable()
@Component({
  selector: 'app-coke-can-scene',
  templateUrl: './coke-can-scene.component.html',
  styleUrls: ['./coke-can-scene.component.css']
})
export class CokeCanSceneComponent extends LssScene implements OnInit {

  constructor(
    private innerGame : AsteroidsGame,
    private outerSceneSvc : OuterSceneService,
    private base : BaseService,
    private utils : UtilsService
  ) { 
    super(base);
  }

  ngOnInit() {
  }

  getProjectionMesh() : THREE.Mesh {
    let projectionMesh = null;

    if (document.querySelector('#aframe-cyl')) {
      projectionMesh = (document.querySelector('#aframe-cyl') as any).object3D.children[0];
    }

    return projectionMesh;
  }

  getBaseTexture() : THREE.Texture {
    return new THREE.TextureLoader().load( "../../../../assets/img/coke-label.jpg" );  
  }

  trackDolly (pos : THREE.Vector3){
    return this.utils.trackDollySpherical(pos, this);
  }

}
