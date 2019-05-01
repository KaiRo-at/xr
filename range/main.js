/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

var hits = 0;
var hitsDisplay = null;

window.onload = function() {
  hitsDisplay = document.querySelector("#scoredisplay");
  // Hook up trigger button inside the VR.
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
  //if (batteryfill <= 0) { return; }
  var rayElement = event.target.querySelector(".ray");
  rayElement.emit("activate", {el: rayElement}, false);
}

function stopShooting(event) {
  var rayElement = event.target.querySelector(".ray");
  rayElement.emit("deactivate", {el: rayElement}, false);
}

function targetHit(event) {
  event.target.emit("hit", {el: event.detail.el}, false);
  hits++;
  if (hitsDisplay) {
    hitsDisplay.setAttribute("text", {value: hits});
  }
}

function targetCleared(event) {
  event.target.emit("hit-cleared", {el: event.detail.el}, false);
}
