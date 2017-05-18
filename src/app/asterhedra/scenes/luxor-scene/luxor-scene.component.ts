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
      // tick:  (time, timeDelta) => {
      //   let a = 1;
      // }.bind(this)
      tick: function (t, dt) {
        // THREE.AnimationHandler.update( dt );
        let a = 1;
      // }.bind(this)
      }
    });
  }

  ngOnInit() {
  }

  doIt(e : Event){
    // e.d

    console.log(`doIt: e.target.id=${(e as any).target.id}`);
  }

  // initColladaScene( e : Event) {
  //   e.detail.model.traverse( function ( child ) {
  //     if ( child instanceof THREE.SkinnedMesh ) {
  //       var animation = new THREE.Animation( child, child.geometry.animation );
  //       animation.play();
  //     }
  //     this.initScene();
  //   })
  // }

  initScene() {
    this.sceneObj = (document.querySelector('a-scene') as any).object3D;
    this.pyramid = this.sceneObj.getObjectByName('Pyramid');
    // debugger;
    var fontLoader = new THREE.FontLoader();

    // fontLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
    //
    //   var textGeom = new THREE.TextGeometry( 'hi', {
    //     font: font,
    //     size: 80,
    //     height: 1,
    //   } as any);
    //   let textMat = new THREE.MeshBasicMaterial({ color: 0x00ff00});
    //
    //   let vertices = (this.pyramid.children[0] as any).geometry.getAttribute('position');
    //
    //   let boxGeom = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    //   let boxMat = new THREE.MeshBasicMaterial({ color: 0xff0000});
    //   for( let i=16; i < vertices.count ; i += 2) {
    //     var pos_1 = new THREE.Vector3();
    //     pos_1.x = vertices.array[i + 0];
    //     pos_1.y = vertices.array[i + 1];
    //     pos_1.z = vertices.array[i + 2];
    //
    //     let markerBox = new THREE.Mesh(boxGeom, boxMat);
    //     markerBox.position.x = pos_1.x;
    //     markerBox.position.y = pos_1.y;
    //     markerBox.position.z = pos_1.z;
    //     this.sceneObj.add(markerBox);
    //
    //     let textMesh = new THREE.Mesh( textGeom, textMat );
    //     textMesh.position.x = pos_1.x;
    //     textMesh.position.y = pos_1.y;
    //     textMesh.position.z = pos_1.z;
    //     this.sceneObj.add(textMesh);
    //
    //     var pos_2 = new THREE.Vector3();
    //     pos_2.x = vertices.array[i + 3];
    //     pos_2.y = vertices.array[i + 4];
    //     pos_2.z = vertices.array[i + 5];
    //
    //     var material = new THREE.LineBasicMaterial({
    //       // color: 0xffffff
    //       color : Math.random() * 65535 * 255,
    //       linewidth: 4
    //     });
    //     var geometry = new THREE.Geometry();
    //     geometry.vertices.push(
    //       pos_1, pos_2
    //     );
    //
    //     var line = new THREE.Line( geometry, material );
    //     this.sceneObj.add( line );
    //   }
    // });

    console.log(`LuxorSceneComponent.initScene: entered`);
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
    // // Arm
    // let armMesh = sceneObj.getObjectByName('Arm');
    // let armMat = armMesh.children[0].material;
    // armMat.side = THREE.DoubleSide;
    // armMat.map = vegasVicTexture;
    // armMat.needsUpdate = true;
    // armMat.update();
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
