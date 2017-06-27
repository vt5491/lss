// Created: 2017-06-26
//
// This is basically just an aframe component wrapped in an angular shell.
// We wrap it in an angular shell so it's easier to load and maniuplute by
// other angular components, but it's really an aframe component at heart.
// It refers back to the outer scene.  The outer scene object must have an
// 'udateScene' method, and an 'innerGame' object.
import { Injectable } from '@angular/core';

@Injectable()
export class InnerSceneRendererService {

  constructor(embeddedContext: any) {
    AFRAME.registerComponent('inner-scene-renderer', {
      init: function() {
        this.init_ang(this.generateDataTexture_af);
      },
      // init: () => {
      init_ang: function (generateDataTextureFn) {
        console.log(`inner-scene-renderer.init: seedAsteroidsCount=${this.innerGame.seedAsteroidCount}`);
        this.innerGame.innerWebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
        this.innerGame.gl_innerWebGLRenderer = this.innerGame.innerWebGLRenderer.getContext();
        this.innerGame.offscreenBuffer = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter })
        this.innerGame.innerGameWidth = window.innerWidth;
        this.innerGame.innerGameHeight = window.innerHeight;
        // this.offscreenImageBuf = this.generateDataTexture(this.innerGameWidth, this.innerGameHeight, new THREE.Color(0x000000));
        this.innerGame.offscreenImageBuf = generateDataTextureFn(this.innerGame.innerGameWidth, this.innerGame.innerGameHeight, new THREE.Color(0x000000));
        this.innerGame.innerSceneCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
        this.innerGame.innerSceneCamera.position.z = 5.0;
      }.bind(embeddedContext),
      tick: function(t, dt) {
      // tick: (t, dt) => {
        let a = 1;
        
        // the parent context needs to have an updateScene method.
        this.innerGame.updateScene();
        this.innerGame.webGLRenderer = (document.querySelector('a-scene') as any).renderer;
        this.innerGame.gl_webGLRenderer = this.innerGame.webGLRenderer.getContext();
        // this.innerGame.innerWebGLRenderer.render(
        this.innerGame.webGLRenderer.render(
          // this.innerScene,
          // this._scene,
          this.innerGame.scene,
          this.innerGame.innerSceneCamera,
          this.innerGame.offscreenBuffer
          // this.offscreenImageBuf
        );

        try {
          // note: readPixels puts the result into the fourth function arg
          // e.g this.offscreenImageBuf.image.data
          this.innerGame.gl_webGLRenderer.readPixels(0, 0,
            window.innerWidth, window.innerHeight,
            this.innerGame.gl_webGLRenderer.RGBA,
            this.innerGame.gl_webGLRenderer.UNSIGNED_BYTE,
            this.innerGame.offscreenImageBuf.image.data
          );
        }
        catch (e) {
          console.log(`torus.proj.mainLoop: caught error ${e}`)
        }

        this.innerGame.offscreenImageBuf.needsUpdate = true; //need this

        var mesh;
        // if (document.querySelector('#test-plane')) {
        //   mesh = (document.querySelector('#test-plane') as any).object3D.children[0];
        //   mesh.material.map = this.innerGame.offscreenImageBuf;
        //   mesh.material.needsUpdate = true;
        //   mesh.material.map.needsUpdate = true;
        //   this.innerGame.offscreenImageBuf.needsUpdate = true; //need this
        // }
        // if ((document.querySelector('#luxor-model') as any).object3D.getObjectByName('Cube')) {
        mesh = this.getProjectionMesh();
        if (mesh) {
          // var mesh = (document.querySelector('#luxor-model') as any).object3D.getObjectByName('Cube');
          mesh.material.map = this.innerGame.offscreenImageBuf;
          mesh.material.needsUpdate = true;
          mesh.material.map.needsUpdate = true;
          this.innerGame.offscreenImageBuf.needsUpdate = true; //need this
        }
      }.bind(embeddedContext),
      generateDataTexture_af: function (width, height, color) {
        console.log(`inner-scene-renderer.generateDataTexture_af: entered`);
        var size = width * height;
        var data = new Uint8Array(4 * size);

        var texture = new (THREE.DataTexture as any)(data, width, height, THREE.RGBAFormat)
        texture.needsUpdate = true;

        return texture;
      },
    })
  }
}
