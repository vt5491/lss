AFRAME.registerComponent('dynamic-scene-texture-2', {
  schema: {
    'innerSceneObj': {type: 'asset', default: {}},
  },  // System schema. Parses into `this.data`.
  init: function () {
    console.log('dynamicSceneTexture.init: entered');
    this.innerWebGLRenderer = new THREE.WebGLRenderer({antialias: true});
    this.gl_innerWebGLRenderer = this.innerWebGLRenderer.getContext();
    this.offscreenBuffer = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter } )
    this.innerGameWidth = window.innerWidth;
    this.innerGameHeight = window.innerHeight;
    this.offscreenImageBuf = this.generateDataTexture(this.innerGameWidth, this.innerGameHeight, new THREE.Color(0x000000));

    if (this.data.innerSceneObj && THREE.Cache.files[this.data.innerSceneObj]) {
      var innerSceneObj = eval(THREE.Cache.files[this.data.innerSceneObj]);

      innerSceneObj.init();
    }
    else {
      console.log('dynamicSceneTexture.init: please provide an inner scene');
    }

  },
  tick : function (time, timeDelta) {
    //TODO: put the scene update controls in the innerSceneObj
    // this.theta += Math.PI / 180.0 * 2.0;

    this.cube.rotateY(Math.PI / 180.0 * 2.0);
    this.webGLRenderer = document.querySelector('a-scene').renderer;
    this.gl_webGLRenderer = this.webGLRenderer.getContext();
    // this.innerWebGLRenderer.render(
    this.webGLRenderer.render(
      this.innerScene,
      this.innerSceneCamera,
      this.offscreenBuffer
      // this.offscreenImageBuf
    );

    try {
      // note: readPixels puts the result into the fourth function arg
      // e.g this.offscreenImageBuf.image.data
      this.gl_webGLRenderer.readPixels(0, 0,
        window.innerWidth, window.innerHeight,
        this.gl_webGLRenderer.RGBA,
        this.gl_webGLRenderer.UNSIGNED_BYTE,
        this.offscreenImageBuf.image.data
      );
    }
    catch (e) {
      console.log(`torus.proj.mainLoop: caught error ${e}`)
    }

    this.offscreenImageBuf.needsUpdate = true; //need this

    // this.outerSspScene.sspMaterial.map = this.offscreenImageBuf;
    // debugger;
    // this.el.object3D.children[0].material.map = this.offscreenImageBuf;
    // if (this.el.sceneEl.object3D.children[2].children[0]) {
    //   // var pyr = this.el.sceneEl.object3D.children[2].children["0"].children["0"].children[5].children["0"]
    //   var pyr = this.el.sceneEl.object3D.children[2].children["0"].children["0"].children[5].children["0"].children["0"];
    //   pyr.material.map = this.offscreenImageBuf;
    // }

    // if(this.el.sceneEl.object3D.getObjectByName('Pyramid')) {
    //   var mesh = this.el.sceneEl.object3D.getObjectByName('Pyramid');
    // if(this.el.sceneEl.object3D.getObjectByName('Cube')) {
    //   var mesh = this.el.sceneEl.object3D.getObjectByName('Cube');
    if(this.el.sceneEl.object3D.getObjectByName('Plane')) {
      var mesh = this.el.sceneEl.object3D.getObjectByName('Plane');
      mesh.material.map = this.offscreenImageBuf;
      mesh.material.needsUpdate = true;
      mesh.material.map.needsUpdate = true;
      this.offscreenImageBuf.needsUpdate = true; //need this
    }
    // works: Plane.001 is vics shirt
    if(this.el.sceneEl.object3D.getObjectByName('Plane.001')) {
      var mesh = this.el.sceneEl.object3D.getObjectByName('Plane.001');
    // if(this.el.sceneEl.object3D.getObjectByName('Cube')) {
    //   var mesh = this.el.sceneEl.object3D.getObjectByName('Cube');
      mesh.material.map = this.offscreenImageBuf;
      mesh.material.needsUpdate = true;
      mesh.material.map.needsUpdate = true;
      this.offscreenImageBuf.needsUpdate = true; //need this
    }
    // on the old plane
    if (this.el.object3D.children[0] && this.el.object3D.children[0].material) {
      this.el.object3D.children[0].material.map = this.offscreenImageBuf;
    }
  },
  generateDataTexture : function (width, height, color) {
    var size = width * height;
    var data = new Uint8Array(4 * size);

    var texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat)
    texture.needsUpdate = true;

    return texture;
  },

 });
