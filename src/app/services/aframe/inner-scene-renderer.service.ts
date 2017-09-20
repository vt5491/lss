// Created: 2017-06-26
//
// This is basically just an aframe component wrapped in an angular shell.
// We wrap it in an angular shell so it's easier to load and maniuplute by
// other angular components, but it's really an aframe component at heart.
// It refers back to the outer scene.  The outer scene object must have an
// 'udateScene' method, and an 'innerGame' object.
import { Injectable, Output, EventEmitter } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable()
export class InnerSceneRendererService {

  constructor(embeddedContext: any) {
    AFRAME.registerComponent('inner-scene-renderer', {
      init: function() {
        this.init_ang(this.generateDataTexture_af);
      },
      init_ang: function (generateDataTextureFn) {
        this.innerGame.innerWebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
        this.innerGame.gl_innerWebGLRenderer = this.innerGame.innerWebGLRenderer.getContext();
        // default size is (300, 150)
        // changing the default size doesn't really make any difference
        // I'm only leaving in as a reminder that I at least tried this in an
        // attempt to change the inner game logical size of 3.79
        this.innerGame.innerWebGLRenderer.setSize(1024,1024);
        let tmp = this.innerGame.innerWebGLRenderer.getSize();
        this.innerGame.offscreenBuffer = new THREE.WebGLRenderTarget(this.base.innerImgDim, this.base.innerImgDim, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter })
        this.innerGame.innerGameWidth = this.base.innerImgDim;
        this.innerGame.innerGameHeight = this.base.innerImgDim;
        this.innerGame.offscreenImageBuf = generateDataTextureFn(this.innerGame.innerGameHeight, this.innerGame.innerGameHeight, new THREE.Color(0x000000));
        this.innerGame.innerSceneCamera = new THREE.PerspectiveCamera(75, window.innerHeight / window.innerHeight);
        // campera.position.z= 5.0 corresponds to BoundVal of 3.79.
        // campera.position.z= 1.319 corresponds to BoundVal of 1.0.
        this.innerGame.innerSceneCamera.position.z = 5.0;
        // this.innerGame.innerSceneCamera.position.z = 15.0;
        // this.innerGame.innerSceneCamera.position.z = 1.319;
        this.poolBallTexture = this.getBaseTexture(); 
        this.vertShader = document.getElementById('simple-vertex-shader').innerHTML;
        this.fragShader = document.getElementById('simple-fragment-shader').innerHTML;
     }.bind(embeddedContext),
      tick: function(t, dt) {
        let a = 1;
        
        // the parent context needs to have an updateScene method.
        this.innerGame.updateScene();
        this.innerGame.webGLRenderer = (document.querySelector('a-scene') as any).renderer;
        this.innerGame.gl_webGLRenderer = this.innerGame.webGLRenderer.getContext();

        this.innerGame.webGLRenderer.render(
          this.innerGame.scene,
          this.innerGame.innerSceneCamera,
          this.innerGame.offscreenBuffer
        );

        try {
          // note: readPixels puts the result into the fourth function arg
          // e.g this.offscreenImageBuf.image.data
          this.innerGame.gl_webGLRenderer.readPixels(0, 0,
            this.base.innerImgDim, this.base.innerImgDim,
            this.innerGame.gl_webGLRenderer.RGBA,
            this.innerGame.gl_webGLRenderer.UNSIGNED_BYTE,
            this.innerGame.offscreenImageBuf.image.data
          );
        }
        catch (e) {
          console.log(`torus.proj.mainLoop: caught error ${e}`)
        }

        let attributes = {};
        let uniforms = {
          t1: { type: "t", value: this.poolBallTexture },
          t2: { type: "t", value: this.innerGame.offscreenImageBuf }
        };

        let defines = {};
        defines["USE_MAP"] = "";

        let material_shader = new THREE.ShaderMaterial({
          uniforms: uniforms,
          defines: defines,
          vertexShader: this.vertShader,
          fragmentShader: this.fragShader
        });

        this.innerGame.offscreenImageBuf.needsUpdate = true; //need this

        var mesh;
        mesh = this.getProjectionMesh();
        if (mesh) {
          mesh.material = material_shader;
          mesh.material.needsUpdate = true;
          this.innerGame.offscreenImageBuf.needsUpdate = true; //need this
        }
        // and emit an event for any observers who may need to respond to this
        // this.innerSceneTick.emit(null);
        // this.outerGameService.onInnerSceneTick();
        // debugger;
        if (this.outerSceneSvc.trackDolly && this.trackDolly) {
          this.trackDolly(this.innerGame.ship.mesh.position);
        }
      }.bind(embeddedContext),
      generateDataTexture_af: function (width, height, color) {
        var size = width * height;
        var data = new Uint8Array(4 * size);

        var texture = new (THREE.DataTexture as any)(data, width, height, THREE.RGBAFormat)
        texture.needsUpdate = true;

        return texture;
      },
    })
  }
}