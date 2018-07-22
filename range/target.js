/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

AFRAME.registerComponent('target', {
  schema: {
    min: { type: 'vec3', default: {x: -3, y: 2, z: -3} },
    max: { type: 'vec3', default: {x: 3, y: 4, z: 3} },
  },

  init: function () {
    this.hit = false;
    this.maxAccelRandom = 0.01;
    this.maxSpeed = 0.02;
    this.nearZone = new THREE.Vector3(0.5, 0.2, 0.5);
    this.currentAcceleration = new THREE.Vector3();
    this.currentMovement = new THREE.Vector3();
    var self = this;
    this.el.addEventListener('hit', event => {
      this.el.setAttribute("color", "#CC8080");
      this.el.components.sound.playSound();
    });
    this.el.addEventListener('hit-cleared', event => {
      this.el.setAttribute("color", "#8080CC");
    });
  },

  update: function (oldData) {
  },

  tick: function (time, timeDelta) {
    // TODO: respect timeDelta to make speed work well!
    // Add some acceleration
    var newAccel = new THREE.Vector3((Math.random() - 0.5) * 2 * this.maxAccelRandom,
                                     (Math.random() - 0.5) * 2 * this.maxAccelRandom,
                                     (Math.random() - 0.5) * 2 * this.maxAccelRandom);
    if (this.el.object3D.position.x < this.data.min.x + this.nearZone.x) {
      newAccel.x += Math.pow((this.data.min.x - this.el.object3D.position.x) / this.nearZone.x, 2);
    }
    if (this.el.object3D.position.y < this.data.min.y + this.nearZone.y) {
      newAccel.y += Math.pow((this.data.min.y - this.el.object3D.position.y) / this.nearZone.y, 2);
    }
    if (this.el.object3D.position.z < this.data.min.z + this.nearZone.z) {
      newAccel.z += Math.pow((this.data.min.z - this.el.object3D.position.z) / this.nearZone.z, 2);
    }
    if (this.el.object3D.position.x > this.data.max.x - this.nearZone.x) {
      newAccel.x -= Math.pow((this.data.max.x - this.el.object3D.position.x) / this.nearZone.x, 2);
    }
    if (this.el.object3D.position.y > this.data.max.y - this.nearZone.y) {
      newAccel.y -= Math.pow((this.data.max.y - this.el.object3D.position.y) / this.nearZone.y, 2);
    }
    if (this.el.object3D.position.z > this.data.max.z - this.nearZone.z) {
      newAccel.z -= Math.pow((this.data.max.z - this.el.object3D.position.z) / this.nearZone.z, 2);
    }
    this.currentAcceleration = this.currentAcceleration.add(newAccel);
    this.currentMovement = this.currentMovement.add(this.currentAcceleration).clampLength(0, this.maxSpeed);
    var newPosition = this.el.object3D.position.add(this.currentMovement);
    this.el.setAttribute('position', newPosition);
  },
});
