/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

window.onload = function() {
  // Hook up trigger button iside the VR.
  let leftHand = document.querySelector("#left-hand");
  let rightHand = document.querySelector("#right-hand");
  leftHand.addEventListener("triggerdown", startShooting, false);
  rightHand.addEventListener("triggerdown", startShooting, false);
  leftHand.addEventListener("triggerup", stopShooting, false);
  rightHand.addEventListener("triggerup", stopShooting, false);
  for (target of document.querySelectorAll(".target")) {
    target.addEventListener("raycaster-intersected", targetHit, false);
    target.addEventListener("raycaster-intersected-cleared", targetCleared, false);
  }
}

function startShooting(event) {
  var rayElement = event.target.querySelector(".ray");
  rayElement.setAttribute("visible", true);
  rayElement.setAttribute("raycaster", {enabled: true});
  // doesn't really work
  //rayElement.object3D.children[0].material.linewidth = 5;
  rayElement.components.sound.playSound();
}

function stopShooting(event) {
  var rayElement = event.target.querySelector(".ray");
  rayElement.setAttribute("visible", false);
  rayElement.setAttribute("raycaster", {enabled: false});
  // Manually clear any ongoing hits.
  for (target of rayElement.components.raycaster.intersectedEls) {
    target.emit("hit-cleared", {el: rayElement}, false);
  }
  rayElement.components.sound.stopSound();
}

function targetHit(event) {
  event.target.emit("hit", {el: event.detail.el}, false);
}

function targetCleared(event) {
  event.target.emit("hit-cleared", {el: event.detail.el}, false);
}
