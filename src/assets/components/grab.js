/* global AFRAME */

/**
* Handles events coming from the hand-controls.
* Determines if the entity is grabbed or released.
* Updates its position to move along the controller.
*/
AFRAME.registerComponent('grab', {
  init: function () {
    this.GRABBED_STATE = 'grabbed';
    //vt add
    this.grabbing = false;
    this.triggering = false;
    //vt end
    // Bind event handlers
    this.onHit = this.onHit.bind(this);
    this.onGripOpen = this.onGripOpen.bind(this);
    this.onGripClose = this.onGripClose.bind(this);
    //vt add
    this.onGripDown = this.onGripDown.bind(this);
    this.onGripUp = this.onGripUp.bind(this);
    //vt end
  },

  play: function () {
    var el = this.el;
    el.addEventListener('hit', this.onHit);
    el.addEventListener('gripclose', this.onGripClose);
    el.addEventListener('gripopen', this.onGripOpen);
    //vt add
    //el.addEventListener('gripdown', this.onGripDown, {once: false});
    //el.addEventListener('gripdown', this.onGripDown, {once: true});
    el.addEventListener('gripdown', this.onGripDown);
    el.addEventListener('gripup', this.onGripUp);
    // el.addEventListener('triggerdown', this.onTriggerDown);
    // el.addEventListener('triggerup', this.onTriggerClose);
    //vt end
    // el.addEventListener('thumbup', this.onGripClose);
    // el.addEventListener('thumbdown', this.onGripOpen);
    // el.addEventListener('pointup', this.onGripClose);
    // el.addEventListener('pointdown', this.onGripOpen);
  },

  pause: function () {
    var el = this.el;
    el.removeEventListener('hit', this.onHit);
    el.removeEventListener('gripclose', this.onGripClose);
    el.removeEventListener('gripopen', this.onGripOpen);
    //vt add
    // el.removeEventListener('triggerdown', this.onTriggerDown);
    // el.removeEventListener('triggerup', this.onTriggerClose);
    el.removeEventListener('gripdown', this.onGripDown);
    el.removeEventListener('gripup', this.onGripUp);
    //vt end
    // el.removeEventListener('thumbup', this.onGripClose);
    // el.removeEventListener('thumbdown', this.onGripOpen);
    // el.removeEventListener('pointup', this.onGripClose);
    // el.removeEventListener('pointdown', this.onGripOpen);
  },

  onGripClose: function (evt) {
    // console.log(`now in onGripClose`);
    this.grabbing = true;
    //vt add
    this.gripping = false;
    //vt end
    delete this.previousPosition;
  },

  onGripOpen: function (evt) {
    var hitEl = this.hitEl;
    this.grabbing = false;
    if (!hitEl) { return; }
    hitEl.removeState(this.GRABBED_STATE);
    this.hitEl = undefined;
  },

  //vt add
  onTriggerDown: function (evt) {
    // console.log(`now in onTriggerDown`);
    this.triggering = true;
    delete this.previousPosition;
  },

  onTriggerUp: function (evt) {
    this.triggering = false;
    // delete this.previousPosition;
  },

  onGripDown: function (evt) {
    // console.log(`now in onGripDown`);
    this.gripping = true;
    delete this.previousRotation;
  },

  onGripUp: function (evt) {
    this.gripping = false;
    // delete this.previousPosition;
  },
  //vt end

  onHit: function (evt) {
    var hitEl = evt.detail.el;
    // If the element is already grabbed (it could be grabbed by another controller).
    // If the hand is not grabbing the element does not stick.
    // If we're already grabbing something you can't grab again.
    if (!hitEl || hitEl.is(this.GRABBED_STATE) || !this.grabbing || this.hitEl) { return; }
    hitEl.addState(this.GRABBED_STATE);
    this.hitEl = hitEl;
  },

  // tick: function () {
  //   var hitEl = this.hitEl;
  //   var position;
  //   if (!hitEl) { return; }
  //   this.updateDelta();
  //   position = hitEl.getAttribute('position');
  //   hitEl.setAttribute('position', {
  //     x: position.x + this.deltaPosition.x,
  //     y: position.y + this.deltaPosition.y,
  //     z: position.z + this.deltaPosition.z
  //   });
  // },
  tick: function () {
    // console.log(`tick: triggering=${this.triggering}`);
    // console.log(`tick: gripping=${this.gripping}`);
    let dollyEl = document.querySelector('#dolly');
    if (this.gripping && !this.grabbing) {
      let cameraEl = document.querySelector('#camera');
      let cameraObj = cameraEl.object3D;
      // console.log(`tick: would do grabbing action here`);
      var rotation;

      this.updateDeltaRotation();
      let pullLeverage = 0.75;
      // let dollyObj = dollyEl.object3D;
      rotation = dollyEl.getAttribute('rotation');
      // rotation = cameraEl.getAttribute('rotation');
      dollyEl.setAttribute('rotation', {
      // cameraEl.setAttribute('rotation', {
      //   // x: rotation.x - this.deltaRotation.x * pullLeverage,
        y: rotation.y - this.deltaRotation.y * pullLeverage
        // y: this.deltaRotation.y * pullLeverage,
      //   // z: rotation.z - this.deltaRotation.z * pullLeverage
      });
      // cameraObj.rotation.y += this.deltaRotation.y * pullLeverage;
    }
    else if (this.grabbing) {
    // if (this.triggering) {
      var position;

      this.updateDelta();
      let pullLeverage = 30.0;
      // let dollyObj = dollyEl.object3D;
      position = dollyEl.getAttribute('position');
      dollyEl.setAttribute('position', {
        x: position.x - this.deltaPosition.x * pullLeverage,
        y: position.y - this.deltaPosition.y * pullLeverage,
        z: position.z - this.deltaPosition.z * pullLeverage
      });
    }
  },

  updateDelta: function () {
    var currentPosition = this.el.getAttribute('position');
    var previousPosition = this.previousPosition || currentPosition;
    var deltaPosition = {
      x: currentPosition.x - previousPosition.x,
      y: currentPosition.y - previousPosition.y,
      z: currentPosition.z - previousPosition.z
    };
    this.previousPosition = currentPosition;
    this.deltaPosition = deltaPosition;
  },

  //vt add
  updateDeltaRotation: function () {
    var currentRotation = this.el.getAttribute('rotation');
    var previousRotation = this.previousRotation || currentRotation;
    var deltaRotation = {
      x: currentRotation.x - previousRotation.x,
      y: currentRotation.y - previousRotation.y,
      z: currentRotation.z - previousRotation.z
    };
    this.previousRotation = currentRotation;
    this.deltaRotation = deltaRotation;
  }
  //vt end
})
;
