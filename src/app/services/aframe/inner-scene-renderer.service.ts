// Created: 2017-06-26
//
// This is basically just an aframe component wrapped in an angular shell.
// We wrap it in an angular shell so it's easier to load and maniuplute by
// other angular components, but it's really an aframe component at heart.
// It refers back to the outer scene.  The outer scene object must have an
// 'udateScene' method, and an 'innerGame' object.
// The a-frame component embedded here basically corresponds to 'projSceneComp'
// in other modules (e.g lss-scene.ts).
import { Injectable, Output, EventEmitter } from '@angular/core';
import { BaseService } from '../base.service';
import { UtilsService } from '../utils.service';

@Injectable()
export class InnerSceneRendererService {
  embeddedContext;
  // innerGame;
  // bgTexture;
  // vertShader;

  constructor(embeddedContext: any,
    // private base : BaseService,
    // private utils : UtilsService
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
        if (that.embeddedContext.projSceneComp.data.subtractiveOverlay) {
          that.embeddedContext.fragShader = document.getElementById('subtractive-fragment-shader').innerHTML;
        }
      },
    //   init_ang: function (generateDataTextureFn) {
    //     this.innerGame.webGLRenderer = (document.querySelector('a-scene') as any).renderer;
    //     this.innerGame.innerWebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
    //     this.innerGame.gl_innerWebGLRenderer = this.innerGame.innerWebGLRenderer.getContext();
    //     // default size is (300, 150)
    //     // changing the default size doesn't really make any difference
    //     // I'm only leaving in as a reminder that I at least tried this in an
    //     // attempt to change the inner game logical size of 3.79
    //     // this.innerGame.innerWebGLRenderer.setSize(1024,1024);
    //     // let tmp = this.innerGame.innerWebGLRenderer.getSize();
    //     let innerImgDim = this.utils.getOuterState('innerImgDim') || this.base.innerImgDim;
    //     this.base.innerImgDim = innerImgDim;
    //     console.log(`InnerSceneRendererService.ctor: base.innerImgDim=${this.base.innerImgDim}`);
        
    //     this.innerGame.offscreenBuffer = new THREE.WebGLRenderTarget(this.base.innerImgDim, this.base.innerImgDim, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter })
    //     // this.innerGame.offscreenBuffer = new THREE.WebGLRenderTarget(innerImgDim, innerImgDim, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter })
    //     this.innerGame.innerGameWidth = this.base.innerImgDim;
    //     this.innerGame.innerGameHeight = this.base.innerImgDim;
    //     this.innerGame.offscreenImageBuf = generateDataTextureFn(this.innerGame.innerGameHeight, this.innerGame.innerGameHeight, new THREE.Color(0x000000));
    //     this.innerGame.innerSceneCamera = new THREE.PerspectiveCamera(75, window.innerHeight / window.innerHeight);
    //     // campera.position.z= 5.0 corresponds to BoundVal of 3.79.
    //     // campera.position.z= 1.319 corresponds to BoundVal of 1.0.
    //     this.innerGame.innerSceneCamera.position.z = 5.0;
    //     // this.innerGame.innerSceneCamera.position.z = 15.0;
    //     // this.innerGame.innerSceneCamera.position.z = 1.319;
    //     this.bgTexture = this.getBaseTexture(); 
    //     this.vertShader = document.getElementById('simple-vertex-shader').innerHTML;
    //     debugger;
    //     if(this.projSceneComp.data.subtractiveOverlay) {
    //       this.fragShader = document.getElementById('subtractive-fragment-shader').innerHTML;
    //     }
    //     else {
    //       this.fragShader = document.getElementById('simple-fragment-shader').innerHTML;
    //     }
    //     // let gl = this.innerGame.innerWebGLRenderer.context;
    //     // let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    //     // gl.shaderSource(fragShader, (document as any).LSS.simpleFragmentShaderSrc);
    //     // gl.compileShader(fragShader);
        
    //     // gl.attachShader(this, fragShader);
    //     let attributes = {};
    //     let uniforms = {
    //       t1: { type: "t", value: this.poolBallTexture },
    //       t2: { type: "t", value: this.innerGame.offscreenImageBuf }
    //     };

    //     let defines = {};
    //     defines["USE_MAP"] = "";

    //     this.material_shader = new THREE.ShaderMaterial({
    //       uniforms: uniforms,
    //       defines: defines,
    //       vertexShader: this.vertShader,
    //       fragmentShader: this.fragShader,
    //       side: THREE.DoubleSide
    //     });

    //     this.projSceneComp.el.addEventListener('togglePauseGame', () => {
    //       console.log(`InnerSceneRender: toggle pauseGame event detected`);
    //       this.projSceneComp.data.gamePaused = !this.projSceneComp.data.gamePaused;
    //     });
    //     this.projSceneComp.el.addEventListener('pauseGame', () => {
    //       console.log(`InnerSceneRender: pauseGame event detected`);
    //       this.projSceneComp.data.gamePaused = true;
    //     });
    //     this.projSceneComp.el.addEventListener('unPauseGame', () => {
    //       console.log(`InnerSceneRender: unPauseGame event detected`);
    //       this.projSceneComp.data.gamePaused = false;
    //     })

    //  }.bind(embeddedContext),
      tick: function(t, dt) {
        //TODO: call component.pause() instead
        if (this.projSceneComp.data.gamePaused) {
          return;
        }
        // let a = 1;
        let innerGame = that.embeddedContext.innerGame;
        if(!innerGame.webGLRenderer) {
          // this.innerGame.webGLRenderer = (document.querySelector('a-scene') as any).renderer;
          return;
        }
        
        // the parent context needs to have an updateScene method.
        // this.innerGame.updateScene(dt);
        innerGame.updateScene(dt);
        // this.innerGame.webGLRenderer = (document.querySelector('a-scene') as any).renderer;
        // We need to refresh this every time and cannot rely on the one initially
        // set in 'init_ang'.
        // debugger;
        // this.innerGame.gl_webGLRenderer = this.innerGame.webGLRenderer.getContext();
        innerGame.gl_webGLRenderer = innerGame.webGLRenderer.getContext();

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
          t1: { type: "t", value: this.bgTexture },
          t2: { type: "t", value: this.innerGame.offscreenImageBuf }
        };

        let defines = {};
        defines["USE_MAP"] = "";

        let material_shader = new THREE.ShaderMaterial({
          uniforms: uniforms,
          defines: defines,
          vertexShader: this.vertShader,
          fragmentShader: this.fragShader,
          side: THREE.DoubleSide
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
      // generateDataTexture_af: function (width, height, color) {
      //   var size = width * height;
      //   var data = new Uint8Array(4 * size);

      //   var texture = new (THREE.DataTexture as any)(data, width, height, THREE.RGBAFormat)
      //   texture.needsUpdate = true;

      //   return texture;
      // },
    })
  }

  init() {
    // let generateDataTexture_af = function (width, height, color) {
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
    // campera.position.z= 5.0 corresponds to BoundVal of 3.79.
    // campera.position.z= 1.319 corresponds to BoundVal of 1.0.
    innerGame.innerSceneCamera.position.z = 5.0;
    // this.innerGame.innerSceneCamera.position.z = 15.0;
    // this.innerGame.innerSceneCamera.position.z = 1.319;
    // this.bgTexture = this.getBaseTexture();
    this.embeddedContext.bgTexture = this.embeddedContext.getBaseTexture();
    this.embeddedContext.vertShader = document.getElementById('simple-vertex-shader').innerHTML;
    // debugger;
    // if (this.embeddedContext.projSceneComp.data.subtractiveOverlay) {
    //   this.embeddedContext.fragShader = document.getElementById('subtractive-fragment-shader').innerHTML;
    // }
    // else {
      this.embeddedContext.fragShader = document.getElementById('simple-fragment-shader').innerHTML;
    // }

    let attributes = {};
    let uniforms = {
      t1: { type: "t", value: this.embeddedContext.poolBallTexture },
      t2: { type: "t", value: this.embeddedContext.innerGame.offscreenImageBuf }
    };

    let defines = {};
    defines["USE_MAP"] = "";

    this.embeddedContext.material_shader = new THREE.ShaderMaterial({
      uniforms: uniforms,
      defines: defines,
      vertexShader: this.embeddedContext.vertShader,
      fragmentShader: this.embeddedContext.fragShader,
      side: THREE.DoubleSide
    });

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