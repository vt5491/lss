var registerComponent = require('../core/component').registerComponent;
var debug = require('../utils/debug');
var bind = require('../utils/bind');
var THREE = require('../lib/three');

var warn = debug('components:sound:warn');

/**
 * Sound component.
 */
module.exports.Component = registerComponent('sound', {
  schema: {
    autoplay: {default: false},
    distanceModel: {default: 'inverse',
      oneOf: ['linear', 'inverse', 'exponential']},
    //vt add
    fadeOutTime: {type: 'int'},
    //TODO: cannot assumed a fixed tick rate
    fadeOutTick: {type: 'int', default: 15},
    //vt end
    loop: {default: false},
    maxDistance: {default: 9999},
    on: {default: ''},
    poolSize: {default: 1},
    positional: {default: true},
    refDistance: {default: 1},
    rolloffFactor: {default: 1},
    src: {type: 'audio'},
    volume: {default: 1}
  },

  multiple: true,

  init: function () {
    //vt add
    warn('vt: now in aframe official sound.init, this.id=' + this.id);
    //vt end
    this.listener = null;
    this.audioLoader = new THREE.AudioLoader();
    this.pool = new THREE.Group();
    //vt add
    // this.poolState = [this.data.poolSize];
    this.initPoolState();
    //vt end
    this.loaded = false;
    this.mustPlay = false;
    this.playSound = bind(this.playSound, this);
  },

  update: function (oldData) {
    var data = this.data;
    var srcChanged = data.src !== oldData.src;
    // Create new sound if not yet created or changing `src`.
    if (srcChanged) {
      if (!data.src) {
        warn('Audio source was not specified with `src`');
        return;
      }
      this.setupSound();
    }

    this.pool.children.forEach(function (sound) {
      if (data.positional) {
        sound.setDistanceModel(data.distanceModel);
        sound.setMaxDistance(data.maxDistance);
        sound.setRefDistance(data.refDistance);
        sound.setRolloffFactor(data.rolloffFactor);
      }
      sound.setLoop(data.loop);
      sound.setVolume(data.volume);
      sound.isPaused = false;
    });

    if (data.on !== oldData.on) {
      this.updateEventListener(oldData.on);
    }
    // All sound values set. Load in `src`.
    if (srcChanged) {
      var self = this;

      this.loaded = false;
      this.audioLoader.load(data.src, function (buffer) {
        self.pool.children.forEach(function (sound) {
          sound.setBuffer(buffer);
        });
        self.loaded = true;

        // Remove this key from cache, otherwise we can't play it again
        THREE.Cache.remove(data.src);
        if (self.data.autoplay || self.mustPlay) { self.playSound(); }
        self.el.emit('sound-loaded');
      });
    }
  },

  pause: function () {
    this.stopSound();
    this.removeEventListener();
  },

  play: function () {
    if (this.data.autoplay) { this.playSound(); }
    this.updateEventListener();
  },

  remove: function () {
    this.removeEventListener();
    this.el.removeObject3D(this.attrName);
    try {
      this.pool.children.forEach(function (sound) {
        sound.disconnect();
      });
    } catch (e) {
      // disconnect() will throw if it was never connected initially.
      warn('Audio source not properly disconnected');
    }
  },

  /**
  *  Update listener attached to the user defined on event.
  */
  updateEventListener: function (oldEvt) {
    var el = this.el;
    if (oldEvt) { el.removeEventListener(oldEvt, this.playSound); }
    el.addEventListener(this.data.on, this.playSound);
  },

  removeEventListener: function () {
    this.el.removeEventListener(this.data.on, this.playSound);
  },

  /**
   * Removes current sound object, creates new sound object, adds to entity.
   *
   * @returns {object} sound
   */
  setupSound: function () {
    var el = this.el;
    var sceneEl = el.sceneEl;

    if (this.pool.children.length > 0) {
      this.stopSound();
      el.removeObject3D('sound');
    }

    // Only want one AudioListener. Cache it on the scene.
    var listener = this.listener = sceneEl.audioListener || new THREE.AudioListener();
    sceneEl.audioListener = listener;

    if (sceneEl.camera) {
      sceneEl.camera.add(listener);
    }

    // Wait for camera if necessary.
    sceneEl.addEventListener('camera-set-active', function (evt) {
      evt.detail.cameraEl.getObject3D('camera').add(listener);
    });

    // Create [poolSize] audio instances and attach them to pool
    this.pool = new THREE.Group();
    for (var i = 0; i < this.data.poolSize; i++) {
      var sound = this.data.positional ? new THREE.PositionalAudio(listener) : new THREE.Audio(listener);
      this.pool.add(sound);
    }
    el.setObject3D(this.attrName, this.pool);

    this.pool.children.forEach(function (sound) {
      sound.onEnded = function () {
        sound.isPlaying = false;
        el.emit('sound-ended', {index: i});
      };
    });
    //vt add
    // this.poolState = [this.data.poolSize];
    this.initPoolState();
    //vt end
  },

  /**
   * Pause all the sounds in the pool.
   */
  pauseSound: function () {
    this.isPlaying = false;
    this.pool.children.forEach(function (sound) {
      if (!sound.source || !sound.source.buffer || !sound.isPlaying || sound.isPaused) { return; }
      sound.isPaused = true;
      sound.pause();
    });
  },

  /**
   * Look for an unused sound in the pool and play it if found.
   */
  playSound: function () {
    if (!this.loaded) {
      warn('Sound not loaded yet. It will be played once it finished loading');
      this.mustPlay = true;
      return;
    }

    var found = false;
    this.isPlaying = true;
    this.pool.children.forEach(function (sound) {
      if (!sound.isPlaying && sound.buffer && !found) {
        sound.play();
        sound.isPaused = false;
        found = true;
        return;
      }
    });

    if (!found) {
      warn('All the sounds are playing. If you need to play more sounds simultaneously ' +
           'consider increasing the size of pool with the `poolSize` attribute.', this.el);
      return;
    }

    this.mustPlay = false;
  },

  /**
   * Stop all the sounds in the pool.
   */
  stopSound: function () {
    this.isPlaying = false;
    //vt add
    // hijack stop logic if fadeOut specified
    // if (this.data.fadeOutTime > 0) {
    //   this.fadeOut();
    // }
    // else {
    //vt end
    this.pool.children.forEach(function (sound) {
      if (!sound.source || !sound.source.buffer) { return; }
      //vt add
      // if (this.fadeOutTime > 0) {
      //   // this.el.components.sound.fadeOut();
      //   this.fadeOutSound(sound);
      // }
      // else {
      //vt end
      sound.stop();
      //vt add
      // }
      //vt end
    });
  //vt add
  // prematurely end any fade outs.. at the sound level
  for(var i=0; i< this.pool.children.length; i++) {
    var poolState = this.poolState[i];
    var sound = this.pool.children[i];
    poolState.fadeOut = false;
    sound.setVolume(poolState.originalVolume || sound.getVolume());
  }
  // and at global level
  this.fadeOutMode = false;
  // }
  //vt end
  },

  //vt add
  // Return an array of length 'poolSize' of objects/hashes so we can store
  // user-level state information on each sound in the pool.
  initPoolState: function () {
    this.poolState = [];
    for (var i = 0; i < this.data.poolSize; i++) {
      this.poolState.push({});
    }
  },

  fadeOut: function () {
    console.log(`Sound.js.fadeOut: entered`);
    var el = this.el;
    //vt this.pool.children.forEach(function (sound) {
    // this.pool.children.forEach( (sound) => {
    for (var i =0; i< this.pool.children.length; i++) {
      var sound = this.pool.children[i];
      if (!sound.source || !sound.source.buffer) { return; }
      var volumeStep;
      if (this.data.fadeOutTime) {
        volumeStep = sound.getVolume() * (this.data.fadeOutTick / this.data.fadeOutTime);
      }
      else {
        warn('fadeOutTime not set');
      }

      // set sound level state data
      this.poolState[i].volumeStep = volumeStep;
      this.poolState[i].fadeOut = true;
      this.poolState[i].originalVolume = sound.getVolume();
      // this.taperSound(sound, el.data.fadeOutTime, el.data.fadeOutTick);
      // this.taperSound(sound, volumeStep, this.data.fadeOutTick);
      // function taper() {
      //   var vol = Math.max(0, audio.volume - volumeStep);
      //   audio.volume = vol;
      // }
      // set global fade out mode
      this.fadeOutMode = true;
      // this.volumeStep = volumeStep;
    };
  },

  // taperSound: function (sound, volumeStep, fadeOutTick) {
  taperSound: function (sound, volumeStep, poolIndex) {
    // var volumeStep = sound.getVolume() * (el.data.fadeOutTick / el.data.fadeOutTime);
    console.log(`sound.taperSound: sound.getVolume=${sound.getVolume()}`);
    var vol = Math.max(0, sound.getVolume() - volumeStep);
    console.log(`Sound.js.taperSound: vol=${vol}`);
    sound.setVolume(vol);

    // if(sound.getVolume() > 0) {
    //   // var f =
    //   // setTimeout(this.taperSound, volumeStep, fadeOutTick);
    //   // setTimeout(function () { this.taperSound(sound, volumeStep, fadeOutTick)},  fadeOutTick);
    //   setTimeout(this.taperSound.bind(this, sound, volumeStep, fadeOutTick), 4000)
    // }
    // else {
    if (sound.getVolume() == 0) {
      this.poolState[poolIndex].fadeOut = false;
      sound.stop();
      // and restore original volume.
      sound.setVolume(this.poolState[poolIndex].originalVolume);
    }
  },

  // fadeOutSound: function (sound) {
  // },
  //vt end
  //vt add
  // fadeOut: function () {
  //   this.fadeOutMode = true;
  // },
  tick: function (time, delta) {
    // if (this.id == 'thrust') {
    if (this.data.fadeOutTime) {
      console.log(`sound.js: entered tick,this.id=${this.id}, this.fadeOutMode=${this.fadeOutMode}`);
      var foundActiveFadeOut = false;
      if (this.fadeOutMode) {
        for (var i =0; i< this.pool.children.length; i++) {
          var sound = this.pool.children[i];
          var volumeStep = this.poolState[i].volumeStep;
          var soundFadeOut = this.poolState[i].fadeOut;

          if (soundFadeOut) {
            foundActiveFadeOut = true;
            this.taperSound(sound, volumeStep, i);
          }
        }
      }

      if (!foundActiveFadeOut) {
        // set global fadeOut mode to false if all sounds have been fully faded out.
        this.fadeOutMode = false;
      }
    }
  }
  //vt end
});
