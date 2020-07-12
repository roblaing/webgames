"use strict";

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");
const audio_ctx = new window.AudioContext() || new window.webkitAudioContext();
const background = new Image();
const spaceship = new Image();
const asteroid = new Image();
const explosion = new Image();
const splash = new Image();
const missile = new Image();
const debris = new Image();
const sprite_list = [background, spaceship, debris, splash];
let scale = get_scale();

function init() {
  background.src = "nebula_blue.f2014.png";
  spaceship.src = "double_ship.png";
  asteroid.src = "asteroid_blue.png";
  splash.src = "splash.png";
  missile.src = "shot2.png";
  explosion.src = "explosion_alpha.png";
  debris.src = "debris2_blue.png";
}

function get_scale() {
  if (window.innerWidth/window.innerHeight < 1.25) {
    return window.innerWidth/800;
  } else {
    return window/innerHeight/600;
  }
}

/*
function loop() {
  ...
  window.requestAnimationFrame(loop);
}
*/

function key_listener(Bool, event) {
  switch (event.key) {
    case "ArrowLeft":
      inputStates.left = Bool;
      break;
    case "ArrowUp":
      inputStates.up = Bool;
      break;
    case "ArrowRight":
      inputStates.right = Bool;
      break;
    case " ":
      inputStates.space = Bool;
      break;
    default:
      event.preventDefault();
  }
}

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resize);
document.addEventListener('keydown', (event) => key_listener(true,  event));
document.addEventListener('keyup',   (event) => key_listener(false, event));
// window.requestAnimationFrame(loop);
