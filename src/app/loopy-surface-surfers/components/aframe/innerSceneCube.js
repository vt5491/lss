'use strict';

(function () {
  var factory = {};

  //Note how 'this' refers to the parent object not to the factory object due
  // to the the bind() call at the end.
  factory.init = () => {
    console.log(`innerSceneCube.init: entered`);
    this.innerScene = new THREE.Scene();

    // var geometry = new THREE.BoxGeometry( 20, 10, 10 );
    var geometry = new THREE.BoxGeometry( 2, 1, 1 );
    // var geometry = new THREE.BoxGeometry( .2, .1, .1 );
    var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
    this.cube = new THREE.Mesh( geometry, material );

    this.innerScene.add(this.cube);

    this.innerSceneCamera = new THREE.PerspectiveCamera(75, this.innerGameWidth / this.innerGameHeight);
    this.innerSceneCamera.position.z = 5.0;

    this.theta = 0;
  }

  return factory;
}.bind(this))()
