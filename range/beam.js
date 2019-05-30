/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

AFRAME.registerComponent('beam', {
  schema: {
    hand: {
      parse: function (value) {
        if (value.length && value == "left") {
          return value
        }
        else {
          return "right";
        }
      },
      default: "right",
    },
    batterystatus: { type: "selector", default: "" },
  },

  init: function () {
    this.batteryfull = 1000;
    this.batterydrainpersec = 100;
    this.batteryfill = this.batteryfull;
    this.active = false;
    this.batterysize = this.data.batterystatus ? this.data.batterystatus.getAttribute("height") : 1;
    this.fillstatus = this.data.batterystatus ? this.data.batterystatus.querySelector(".batteryfill") : null;
    var self = this;
    this.el.addEventListener("activate", event => {
      if (this.active || this.batteryfill <= 0) { return; }
      this.active = true;
      this.el.setAttribute("visible", true);
      this.el.setAttribute("raycaster", {enabled: true});
      // doesn't really work
      //this.el.object3D.children[0].material.linewidth = 5;
      this.el.components.sound.playSound();
      // workaround: sound not at the actual location but audible
      document.querySelector("#rayshot-" + this.data.hand).play();
    });
    this.el.addEventListener("deactivate", event => {
      this.active = false;
      this.el.setAttribute("visible", false);
      this.el.setAttribute("raycaster", {enabled: false});
      // Manually clear any ongoing hits.
      for (target of this.el.components.raycaster.intersectedEls) {
        target.emit("hit-cleared", {el: this.el}, false);
      }
      this.el.components.sound.stopSound();
      // workaround: sound not at the actual location but audible
      document.querySelector("#rayshot-" + this.data.hand).pause();
    });
  },

  tick: function (time, timeDelta) {
    // drain battery if beam is active
    if (!this.active || this.batteryfill <= 0) { return; }
    // timeDelta is milliseconds since last call.
    this.batteryfill -= this.batterydrainpersec * timeDelta / 1000;
    if (this.batteryfill <= 0) {
      this.el.emit("deactivate", {el: this.el}, false);
    }
    if (this.fillstatus) {
      let newheight = this.batterysize / this.batteryfull * this.batteryfill;
      this.fillstatus.setAttribute("height", newheight);
      this.fillstatus.object3D.position.y = this.data.batterystatus.object3D.position.y - (this.batterysize - newheight) / 2
    }
  },
});
