///<reference path="../../../../../typings/index.d.ts" />
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-luxor-scene',
  templateUrl: './luxor-scene.component.html',
  styleUrls: ['./luxor-scene.component.css']
})
export class LuxorSceneComponent implements OnInit {
  sceneObj : THREE.Object3D;
  pyramid : THREE.Object3D;

  constructor() {
    let luxorSceneComponent = this;
    console.log(`LuxorSceneComponent.ctor: entered`);
    // note : you really need to put in a scene load handler.  This doesnt
    // always work when done in the ctor.
    // note2: not true.  A component.init is only driven once a scene has loaded.
    // note3: you want to define the component before the scene loads.  You of course
    // want to run it once the scene has loaded
    AFRAME.registerComponent('luxor-scene-aframe-component', {
      init: () => {
        console.log(`LoopySurfaceSurfers.AFRAME.init: entered`);
        
        
        // var manager = new THREE.LoadingManager();
				// manager.onProgress = function ( item, loaded, total ) {
				// 	console.log('LuxorSceneComponent.onProgress: ' , item, loaded, total );
				// };
        // setTimeout(this.initScene, 2000);
      //   document.querySelector('a-scene').addEventListener('loaded', () => {
      //     console.log(`scene loaded`);
      //     this.initScene()})
      //   // this.initScene();
        setTimeout( function () {     
          console.log('entering VR');
          // var scene: any = document.querySelector('a-scene');
          // scene.enterVR();
         }, 1000);
      },
      // tick:  (time, timeDelta) => {
      //   let a = 1;
      // }.bind(this)
      tick: function (t, dt) {
        // THREE.AnimationHandler.update( dt );
        let a = 1;
        // luxorSceneComponent.doIt();
      // }.bind(this)
      }
    });
        window.addEventListener('load', function () {
          var scene: any = document.querySelector('a-scene');
          if (scene.hasLoaded) {
            scene.enterVR();
          } else {
            // scene.el.sceneEl.enterVR();
            (scene.parentEl as any).addEventListener('loaded', function () {
              console.log('Automatically entering VR...');
              scene.enterVR();
            });
          }
        });

  }

  ngOnInit() {
  }

  doIt(){
    console.log(`LuxorSceneComponet.doIt: entered`);
  }

  initScene() {
    this.sceneObj = (document.querySelector('a-scene') as any).object3D;
    this.pyramid = this.sceneObj.getObjectByName('Pyramid');
    var fontLoader = new THREE.FontLoader();

    console.log(`LuxorSceneComponent.initScene: entered -lss version`);
    let img = document.querySelector('#vegas-vic-full');
    console.log(`initScene.img=${img}`);
    let vegasVicTexture = new THREE.TextureLoader().load( "../../../../assets/img/vegas_vic_full_no_wc.png" );
    vegasVicTexture.flipY = false;
    let vicHeadTexture = new THREE.TextureLoader().load( "../../../../assets/img/vic_head_texture.jpg" );
    vicHeadTexture.flipY = false;
    // let vegasVicStraightOnTexture = new THREE.TextureLoader().load( "../../../../assets/img/vegas_vic_straight_on.jpg" );
    let vegasVicStraightOnTexture = new THREE.TextureLoader().load( "../../../../assets/img/vic_shirt.png" );
    vegasVicStraightOnTexture.flipY = false;
    let vicLegsTexture = new THREE.TextureLoader().load( "../../../../assets/img/vic_legs.png" );
    vicLegsTexture.flipY = false;
    // let vicArmTexture = new THREE.TextureLoader().load( "../../../../assets/img/vic_arm.png" );
    let vicArmTexture = new THREE.TextureLoader().load( "../../../../assets/img/vic_arm_black.png" );
    vicArmTexture.flipY = false;

    let sceneObj = (document.querySelector('a-scene') as any).object3D;

    // Arm
    let armMesh = sceneObj.getObjectByName('Arm');
    let armMat = armMesh.children[0].material;
    // armMat.side = THREE.DoubleSide;
    // armMat.map = vicArmTexture;
    armMat.map = vegasVicTexture;
    // armMat.map.flipY = true;
    armMat.needsUpdate = true;

    // Face
    let faceMesh = sceneObj.getObjectByName('Face');
    let faceMat = faceMesh.children[0].material;
    faceMat.side = THREE.DoubleSide;
    faceMat.map = vicHeadTexture;
    faceMat.needsUpdate = true;

    // Shirt
    let shirtMesh = sceneObj.getObjectByName('Shirt');
    let shirtMat = shirtMesh.children[0].material;
    // shirtMat.side = THREE.DoubleSide;
    // shirtMat.map = vegasVicStraightOnTexture;
    shirtMat.map = vegasVicTexture;
    shirtMat.needsUpdate = true;

    // Legs
    let legsMesh = sceneObj.getObjectByName('Legs');
    let legsMat = legsMesh.children[0].material;
    // legsMat.side = THREE.DoubleSide;
    // legsMat.map = vicLegsTexture;
    legsMat.map = vegasVicTexture;
    legsMat.needsUpdate = true;

    let loader = new THREE.TextureLoader();
    loader.load( "../../../../assets/img/welcome_to_las_vegas.jpg", (welcomeToLasVegasTexture) => {
      welcomeToLasVegasTexture.flipY = false;

      let objects : string[] = [];
      objects.push('CircleW', 'CircleE1', 'CircleL', 'CircleC', 'CircleO', 'CircleM', 'CircleE2', 'MainBoard');

      for(let i=0; i < objects.length; i++ ) {
        let o = objects[i];
        let mesh = sceneObj.getObjectByName(o);
        let meshMat = mesh.children[0].material;
        meshMat.map = welcomeToLasVegasTexture;
        meshMat.needsUpdate = true;
      }
    });
  }

  animateTowerSides() {

  }

}
