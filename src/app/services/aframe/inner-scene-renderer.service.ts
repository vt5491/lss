// Created: 2017-06-26
//
// This is basically just an aframe component wrapped in an angular shell.
// We wrap it in an angular shell so it's easier to load and maniuplute by
// other angular components, but it's really an aframe component at heart.
// It refers back to the outer scene.  The outer scene object must have an
// 'udateScene' method, and an 'innerGame' object.
// The a-frame component embedded here basically corresponds to 'projSceneComp'
// in other modules (e.g lss-scene.ts).
// Note: embeddedContext is referring to 'lss-scene.ts', which is the parent class to all
// individual scenes e.g. 'planeSceneComponent'
import { Injectable, Output, EventEmitter } from '@angular/core';
import { BaseService } from '../base.service';
import { UtilsService } from '../utils.service';

@Injectable()
export class InnerSceneRendererService {
  public embeddedContext;

  constructor(
    embeddedContext: any,
  ) {
    this.embeddedContext = embeddedContext;
    let that = this;
    AFRAME.registerComponent('inner-scene-renderer', {
      schema : {
        gamePaused: {type : 'boolean', default: false},
        subtractiveOverlay: {type : 'boolean', default: false},
      },
      init: function() {
        console.log(`InnerSceneRender.aframe.init: subtractiveOverlay=${this.data.subtractiveOverlay}`);
        // will this at least smooth the animation out?
        // yes, it does. However, it slows things down too.. probably suggests
        // I need to go to time based movement instead of tick based.
        // this.tick = (AFRAME.utils as any).throttleTick(this.tick, 17, this);
        // this.init_ang(this.generateDataTexture_af);
        // if (that.embeddedContext.projSceneComp.data.subtractiveOverlay) {
        //   that.embeddedContext.fragShader = document.getElementById('subtractive-fragment-shader').innerHTML;
        // }
        // we need to init the material_shader here and not in angular init because
        // projSceneComp.data is only available at aframe init time.
        if (that.embeddedContext.projSceneComp.data.subtractiveOverlay) {
          that.embeddedContext.fragShader = document.getElementById('subtractive-fragment-shader').innerHTML;
        };

        let attributes = {};
        let uniforms = {
          t1: { type: "t", value: that.embeddedContext.bgTexture },
          t2: { type: "t", value: that.embeddedContext.innerGame.offscreenImageBuf }
        };

        let defines = {};
        defines["USE_MAP"] = "";

        that.embeddedContext.material_shader = new THREE.ShaderMaterial({
          uniforms: uniforms,
          defines: defines,
          vertexShader: that.embeddedContext.vertShader,
          fragmentShader: that.embeddedContext.fragShader,
          side: THREE.DoubleSide
        });
      },
      tick: function(t, dt) {
        //TODO: call component.pause() instead
        if (this.projSceneComp.data.gamePaused) {
          return;
        }
        let innerGame = that.embeddedContext.innerGame;
        if(!innerGame.webGLRenderer) {
          // this.innerGame.webGLRenderer = (document.querySelector('a-scene') as any).renderer;
          return;
        }

        // the parent context needs to have an updateScene method.
        innerGame.updateScene(dt);
        // this.innerGame.webGLRenderer = (document.querySelector('a-scene') as any).renderer;
        // We need to refresh this every time and cannot rely on the one initially
        // set in 'init_ang'.
        innerGame.gl_webGLRenderer = innerGame.webGLRenderer.getContext();

        //vt-x
        // this.innerGame.innerSceneCamera.x -= 0.001;
        //vt-x end
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

        this.innerGame.offscreenImageBuf.needsUpdate = true; //need this

        var mesh;
        mesh = this.getProjectionMesh();
        if (mesh) {
          mesh.material = this.material_shader;
          mesh.material.needsUpdate = true;
          this.innerGame.offscreenImageBuf.needsUpdate = true; //need this
        }
        // and emit an event for any observers who may need to respond to this
        if (this.outerSceneSvc.trackDolly && this.trackDolly) {
          this.trackDolly(this.innerGame.ship.mesh.position);
        }
      // }.bind(embeddedContext),
    }.bind(this.embeddedContext),
    })
  }

  init() {
    console.log(`*InnerSceneRenderService.init: entered`);

    let generateDataTextureFn = function (width, height, color) {
      var size = width * height;
      var data = new Uint8Array(4 * size);

      var texture = new (THREE.DataTexture as any)(data, width, height, THREE.RGBAFormat)
      texture.needsUpdate = true;

      return texture;
    }
    let innerGame = this.embeddedContext.innerGame;
    innerGame.webGLRenderer = (document.querySelector('a-scene') as any).renderer;
    innerGame.innerWebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
    innerGame.gl_innerWebGLRenderer = innerGame.innerWebGLRenderer.getContext();
    // default size is (300, 150)
    // changing the default size doesn't really make any difference
    // I'm only leaving in as a reminder that I at least tried this in an
    // attempt to change the inner game logical size of 3.79
    // this.innerGame.innerWebGLRenderer.setSize(1024,1024);
    // let tmp = this.innerGame.innerWebGLRenderer.getSize();
    let utils = this.embeddedContext.utils;
    let base = this.embeddedContext.base;
    // debugger;
    let innerImgDim = utils.getOuterState('innerImgDim') || base.innerImgDim;
    base.innerImgDim = innerImgDim;
    console.log(`InnerSceneRendererService.ctor: base.innerImgDim=${base.innerImgDim}`);

    innerGame.offscreenBuffer = new THREE.WebGLRenderTarget(base.innerImgDim, base.innerImgDim, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter })
    // this.innerGame.offscreenBuffer = new THREE.WebGLRenderTarget(innerImgDim, innerImgDim, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter })
    innerGame.innerGameWidth = base.innerImgDim;
    innerGame.innerGameHeight = base.innerImgDim;
    innerGame.offscreenImageBuf = generateDataTextureFn(innerGame.innerGameHeight, innerGame.innerGameHeight, new THREE.Color(0x000000));
    innerGame.innerSceneCamera = new THREE.PerspectiveCamera(75, window.innerHeight / window.innerHeight);
    // innerGame.innerSceneCamera = new THREE.PerspectiveCamera(75, 1.0);
    // campera.position.z= 5.0 corresponds to BoundVal of 3.79.
    // campera.position.z= 1.319 corresponds to BoundVal of 1.0.
    innerGame.innerSceneCamera.position.x = 0.0;
    innerGame.innerSceneCamera.position.y = 0.0;
    innerGame.innerSceneCamera.position.z = 5.0;
    // innerGame.innerSceneCamera.lookAt(new THREE.Vector3(0,0,0));
    //innerGame.innerSceneCamera.position.z = 150.0;
    // this.innerGame.innerSceneCamera.position.z = 1.319;
    // this.bgTexture = this.getBaseTexture();
    this.embeddedContext.bgTexture = this.embeddedContext.getBaseTexture();
    this.embeddedContext.vertShader = document.getElementById('simple-vertex-shader').innerHTML;
    this.embeddedContext.fragShader = document.getElementById('simple-fragment-shader').innerHTML;

    let projSceneComp = this.embeddedContext.projSceneComp;
    projSceneComp.el.addEventListener('togglePauseGame', () => {
      console.log(`InnerSceneRender: toggle pauseGame event detected`);
      projSceneComp.data.gamePaused = !projSceneComp.data.gamePaused;
    });
    projSceneComp.el.addEventListener('pauseGame', () => {
      console.log(`InnerSceneRender: pauseGame event detected`);
      projSceneComp.data.gamePaused = true;
    });
    projSceneComp.el.addEventListener('unPauseGame', () => {
      console.log(`InnerSceneRender: unPauseGame event detected`);
      projSceneComp.data.gamePaused = false;
    })
  }
}
