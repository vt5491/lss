/**
 * WASD component to control entities using WASD keys.
 * Plus extra keys such as up and down (n, p) and rotate about y axis (q, e).
 */
 // var KEYCODE_TO_CODE = _dereq_('../constants').keyboardevent.KEYCODE_TO_CODE;
var  KEYCODE_TO_CODE = {
  '38': 'ArrowUp',
  '37': 'ArrowLeft',
  '40': 'ArrowDown',
  '39': 'ArrowRight',
  '87': 'KeyW',
  '65': 'KeyA',
  '83': 'KeyS',
  '68': 'KeyD'
}

// var registerComponent = _dereq_('../core/component').registerComponent;
// var THREE = _dereq_('../lib/three');
// var utils = _dereq_('../utils/');

// var bind = utils.bind;
// var shouldCaptureKeyEvent = utils.shouldCaptureKeyEvent;
//vt add
// copied from utils/index.js
/**
 * Returns whether we should capture this keyboard event for keyboard shortcuts.
 * @param {Event} event Event object.
 * @returns {Boolean} Whether the key event should be captured.
 */
// module.exports.shouldCaptureKeyEvent = function (event) {
var shouldCaptureKeyEvent = function (event) {
  if (event.metaKey) { return false; }
  return document.activeElement === document.body;
};

/**
 * Faster version of Function.prototype.bind
 * @param {Function} fn - Function to wrap.
 * @param {Object} ctx - What to bind as context.
 * @param {...*} arguments - Arguments to pass through.
 */
// module.exports = function bind (fn, ctx/* , arg1, arg2 */) {
var bind = function (fn, ctx/* , arg1, arg2 */) {
  return (function (prependedArgs) {
    return function bound () {
      // Concat the bound function arguments with those passed to original bind
      var args = prependedArgs.concat(Array.prototype.slice.call(arguments, 0));
      return fn.apply(ctx, args);
    };
  })(Array.prototype.slice.call(arguments, 2));
};
//vt end

var CLAMP_VELOCITY = 0.00001;
var MAX_DELTA = 0.2;

AFRAME.registerComponent('wasd-plus-controls', {
  schema: {
    acceleration: {default: 65},
    adAxis: {default: 'x', oneOf: ['x', 'y', 'z']},
    adEnabled: {default: true},
    adInverted: {default: false},
    easing: {default: 20},
    enabled: {default: true},
    fly: {default: false},
    wsAxis: {default: 'z', oneOf: ['x', 'y', 'z']},
    wsEnabled: {default: true},
    wsInverted: {default: false},
    //vt add
    inVrState: {default: false}
    //vt end
  },

  init: function () {
    // To keep track of the pressed keys.
    this.keys = {};

    this.velocity = new THREE.Vector3();

    // Bind methods and add event listeners.
    this.onBlur = bind(this.onBlur, this);
    this.onFocus = bind(this.onFocus, this);
    this.onKeyDown = bind(this.onKeyDown, this);
    this.onKeyUp = bind(this.onKeyUp, this);
    this.onVisibilityChange = bind(this.onVisibilityChange, this);
    this.attachVisibilityEventListeners();
		//vt add
		this.vtDeltaRot = new THREE.Euler();
    console.log(`WasdComponent.init: vrState=${this.vrState}`);
		//vt end
  },

  tick: function (time, delta) {
    var data = this.data;
    var el = this.el;
    var movementVector;
    var position;
    var velocity = this.velocity;

    // Use seconds.
    delta = delta / 1000;

    // Get velocity.
    this.updateVelocity(delta);

    //vt add
    //if (this.inVrState) {
    //console.log(`tick: this.inVrState=${this.data.inVrState}`);
    //console.log(`tick: this.inVrState 2=${el.getAttribute('wasd-controls').inVrState}`);
    if (this.data.inVrState === true) {
    //if (el.getAttribute('wasd-controls').inVrState === 'true') {
      rotation = el.getAttribute('rotation');
      //console.log(`tick: now updating rotation`);``

        el.setAttribute('rotation', {
          x: rotation.x + this.vtDeltaRot.x,
          y: rotation.y + this.vtDeltaRot.y,
          z: rotation.z + this.vtDeltaRot.z
        });
    }
    else {
        el.setAttribute('rotation', {
          x: this.vtDeltaRot.x,
          y: this.vtDeltaRot.y,
          z: this.vtDeltaRot.z
        });
    }

    //vt end
    //vtif (!velocity[data.adAxis] && !velocity[data.wsAxis]) { return; }
    if (!velocity[data.adAxis] && !velocity[data.wsAxis] && !velocity['y']) { return; }

    // Get movement vector and translate position.
    movementVector = this.getMovementVector(delta);
    position = el.getAttribute('position');
		//vt add
		// console.log(`aframeMaster: movementVector.x=${movementVector.x}`);
		// console.log(`aframeMaster: movementVector.y=${movementVector.y}`);
		// console.log(`aframeMaster: movementVector.z=${movementVector.z}`);
		//vt end
    el.setAttribute('position', {
      x: position.x + movementVector.x,
      y: position.y + movementVector.y,
      z: position.z + movementVector.z
    });
  },

  remove: function () {
    this.removeKeyEventListeners();
    this.removeVisibilityEventListeners();
  },

  play: function () {
    this.attachKeyEventListeners();
  },

  pause: function () {
    this.keys = {};
    this.removeKeyEventListeners();
  },

  updateVelocity: function (delta) {
    var acceleration;
    var adAxis;
    var adSign;
    var data = this.data;
    var keys = this.keys;
    var velocity = this.velocity;
    var wsAxis;
    var wsSign;
    //vt add
    var pnAxis;
    var pnSign = 1;
    //vt end

    adAxis = data.adAxis;
    wsAxis = data.wsAxis;
    //vt add
    pnAxis = 'y';
    //vt end

    // If FPS too low, reset velocity.
    if (delta > MAX_DELTA) {
      velocity[adAxis] = 0;
      velocity[wsAxis] = 0;
      //vt add
      velocity[pnAxis] = 0;
      //vt end
      return;
    }

    // Decay velocity.
    if (velocity[adAxis] !== 0) {
      velocity[adAxis] -= velocity[adAxis] * data.easing * delta;
    }
    if (velocity[wsAxis] !== 0) {
      velocity[wsAxis] -= velocity[wsAxis] * data.easing * delta;
    }
    //vt add
    if (velocity[pnAxis] !== 0) {
      velocity[pnAxis] -= velocity[pnAxis] * data.easing * delta;
    }
    //vt end

    // Clamp velocity easing.
    if (Math.abs(velocity[adAxis]) < CLAMP_VELOCITY) { velocity[adAxis] = 0; }
    if (Math.abs(velocity[wsAxis]) < CLAMP_VELOCITY) { velocity[wsAxis] = 0; }
    //vt add
    if (Math.abs(velocity[pnAxis]) < CLAMP_VELOCITY) { velocity[pnAxis] = 0; }
    //vt end

    if (!data.enabled) { return; }

    // Update velocity using keys pressed.
    acceleration = data.acceleration;
    if (data.adEnabled) {
      adSign = data.adInverted ? -1 : 1;
      if (keys.KeyA || keys.ArrowLeft) { velocity[adAxis] -= adSign * acceleration * delta; }
      if (keys.KeyD || keys.ArrowRight) { velocity[adAxis] += adSign * acceleration * delta; }
    }
    if (data.wsEnabled) {
      wsSign = data.wsInverted ? -1 : 1;
      if (keys.KeyW || keys.ArrowUp) { velocity[wsAxis] -= wsSign * acceleration * delta; }
      if (keys.KeyS || keys.ArrowDown) { velocity[wsAxis] += wsSign * acceleration * delta; }
    }
    //vt add
    if (keys.KeyP || keys.KeyN) {
      // console.log(`aframeMaster: you pressed p or n key: velocity[pnAxis]=${velocity[pnAxis]}`);
      // pnSign = data.wsInverted ? -1 : 1;
      if (keys.KeyN ) { velocity[pnAxis] -= pnSign * acceleration * delta; }
      if (keys.KeyP ) { velocity[pnAxis] += pnSign * acceleration * delta; }
      // console.log(`aframeMaster: velocity[pnAxis]=${velocity[pnAxis]}`);
    }
    if (keys.KeyQ || keys.KeyE) {
      var rotation = this.el.getAttribute('rotation');

			//if (keys.KeyQ) { this.vtDeltaRot.y +=  Math.PI / 180.0 * 5}
			//if (keys.KeyE) { this.vtDeltaRot.y -=  Math.PI / 180.0 * 5}
			if (keys.KeyQ) { this.vtDeltaRot.y +=   1.0}
			if (keys.KeyE) { this.vtDeltaRot.y -=   1.0}
			// if (keys.KeyQ) { rotation.y +=  Math.PI / 180.0 * 5}
			// if (keys.KeyE) { rotation.y -=  Math.PI / 180.0 * 5}
			// if (keys.KeyQ) { rotation.y +=   5; this.vtDeltaRot += 5.0;}
			// if (keys.KeyE) { rotation.y -=   5; this.vtDeltaRot -= 5.0}

			//rotation.y += this.vtDeltaRot.y;
			// rotation.y += this.vtDeltaRot.y;
			//this.el.setAttribute('rotation', rotation);
		}
    //vt end
  },

getMovementVector: (function () {
  var directionVector = new THREE.Vector3(0, 0, 0);
  var rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');

  return function (delta) {
    var rotation = this.el.getAttribute('rotation');
    var velocity = this.velocity;

    //vt add
    // rotation.y = rotation.y
    //vt add

    directionVector.copy(velocity);
    directionVector.multiplyScalar(delta);

    // Absolute.
    if (!rotation) { return directionVector; }

    if (!this.data.fly) { rotation.x = 0; }

    // Transform direction relative to heading.
    // rotationEuler.set(THREE.Math.degToRad(rotation.x), THREE.Math.degToRad(rotation.y), 0);
    //console.log(`getMovementVector: vtDeltaRot.y=${this.vtDeltaRot.y}`);
    // rotationEuler.set(THREE.Math.degToRad(rotation.x), THREE.Math.degToRad(rotation.y), 0);
    rotationEuler.set(THREE.Math.degToRad(rotation.x), THREE.Math.degToRad(rotation.y + this.vtDeltaRot.y), 0);
    // rotationEuler.set(THREE.Math.degToRad(rotation.x), THREE.Math.degToRad(rotation.y), THREE.Math.degToRad(rotation.z));
    directionVector.applyEuler(rotationEuler);
    //vt add
    // rotation.y += this.vtDeltaRot;
    // rotation = rotationEuler;
    // rotation.y += rotationEuler.y;
    // rotation.y = THREE.Math.radToDeg(rotationEuler.y);
    //this.el.setAttribute('rotation', rotation);
    //vt end
    return directionVector;
  };
})(),

attachVisibilityEventListeners: function () {
  window.addEventListener('blur', this.onBlur);
  window.addEventListener('focus', this.onFocus);
  document.addEventListener('visibilitychange', this.onVisibilityChange);
},

removeVisibilityEventListeners: function () {
  window.removeEventListener('blur', this.onBlur);
  window.removeEventListener('focus', this.onFocus);
  document.removeEventListener('visibilitychange', this.onVisibilityChange);
},

attachKeyEventListeners: function () {
  window.addEventListener('keydown', this.onKeyDown);
  window.addEventListener('keyup', this.onKeyUp);
},

removeKeyEventListeners: function () {
  window.removeEventListener('keydown', this.onKeyDown);
  window.removeEventListener('keyup', this.onKeyUp);
},

onBlur: function () {
  this.pause();
},

onFocus: function () {
  this.play();
},

onVisibilityChange: function () {
  if (document.hidden) {
    this.onBlur();
  } else {
    this.onFocus();
  }
},

onKeyDown: function (event) {
  var code;
  if (!shouldCaptureKeyEvent(event)) { return; }
  code = event.code || KEYCODE_TO_CODE[event.keyCode];
  this.keys[code] = true;
},

onKeyUp: function (event) {
  var code;
  code = event.code || KEYCODE_TO_CODE[event.keyCode];
  this.keys[code] = false;
},

//vt add
onEnterVr: () => {
  console.log(`WasdControls.onEnterVr: entered, inVrState=${this.inVrState}`);
  this.inVrState = true;
  console.log(`WasdControls.onEnterVr: inVrState now =${this.inVrState}`);
},

update: (oldData) => {
  console.log(`WasdControls.update: oldData=${oldData}`);
  //debugger;
}
//vt end
});
