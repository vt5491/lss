import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-luxor-scene',
  templateUrl: './luxor-scene.component.html',
  styleUrls: ['./luxor-scene.component.css']
})
export class LuxorSceneComponent implements OnInit {

  constructor() {
    // note : you really need to put in a scene load handler.  This doesnt
    // always work when done in the ctor.
    // note2: not true.  A component.init is only driven once a scene has loaded.
    // note3: you want to define the component before the scene loads.  You of course
    // want to run it once the scene has loaded
    AFRAME.registerComponent('luxor-scene-aframe-component', {
      init: () => {
        // var manager = new THREE.LoadingManager();
				// manager.onProgress = function ( item, loaded, total ) {
				// 	console.log('LuxorSceneComponent.onProgress: ' , item, loaded, total );
				// };
        // setTimeout(this.initScene, 2000);
      //   document.querySelector('a-scene').addEventListener('loaded', () => {
      //     console.log(`scene loaded`);
      //     this.initScene()})
      //   // this.initScene();
      },
      tick:  (time, timeDelta) => {
        let a = 1;
      }
    });
  }

  ngOnInit() {
  }

  doIt(e : Event){
    // e.d

    console.log(`doIt: e.target.id=${(e as any).target.id}`);
  }

  initScene() {
    console.log(`LuxorSceneComponent.initScene: entered`);
    let img = document.querySelector('#vegas-vic-full');
    console.log(`initScene.img=${img}`);
    let vegasVicTexture = new THREE.TextureLoader().load( "../../../../assets/img/vegas_vic_full_no_wc.png" );
    let vicHeadTexture = new THREE.TextureLoader().load( "../../../../assets/img/vic_head_texture.jpg" );
    vicHeadTexture.flipY = false;
    // let vegasVicStraightOnTexture = new THREE.TextureLoader().load( "../../../../assets/img/vegas_vic_straight_on.jpg" );
    let vegasVicStraightOnTexture = new THREE.TextureLoader().load( "../../../../assets/img/vic_shirt.png" );
    vegasVicStraightOnTexture.flipY = false;
    let vicLegsTexture = new THREE.TextureLoader().load( "../../../../assets/img/vic_legs.png" );
    vicLegsTexture.flipY = false;
    // this is the right hand
    // let blendCharacter = (document.querySelector('a-scene') as any).object3D.children[0].children[1].children[0];
    // let blendCharacter = (document.querySelector('a-scene') as any).object3D.children[0].children[2].children[0];
    // let side = blendCharacter.material.side;
    // console.log(`LuxorSceneComponent.initScene: material.side pre=${side}`)
    // side = THREE.DoubleSide;
    // blendCharacter.material.color.setHex(0xff0000);
    // blendCharacter.material.needsUpdate = true;
    // blendCharacter.material.update();
    // console.log(`LuxorSceneComponent.initScene: material.side post=${side}`)
    // console.log(`LuxorSceneComponent.initScene: material.needsUpdate=${blendCharacter.material.needsUpdate}`)
    let sceneObj = (document.querySelector('a-scene') as any).object3D;
    // Arm
    let armMesh = sceneObj.getObjectByName('Arm');
    let armMat = armMesh.children[0].material;
    armMat.side = THREE.DoubleSide;
    armMat.map = vegasVicTexture;
    armMat.needsUpdate = true;
    // armMat.update();
    // Face
    let faceMesh = sceneObj.getObjectByName('Face');
    let faceMat = faceMesh.children[0].material;
    faceMat.side = THREE.DoubleSide;
    faceMat.map = vicHeadTexture;
    faceMat.needsUpdate = true;

    // Shirt
    let shirtMesh = sceneObj.getObjectByName('Shirt');
    let shirtMat = shirtMesh.children[0].material;
    shirtMat.side = THREE.DoubleSide;
    shirtMat.map = vegasVicStraightOnTexture;
    shirtMat.needsUpdate = true;

    // Legs
    let legsMesh = sceneObj.getObjectByName('Legs');
    let legsMat = legsMesh.children[0].material;
    legsMat.side = THREE.DoubleSide;
    legsMat.map = vicLegsTexture;
    legsMat.needsUpdate = true;
  }

}
