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
let scale = 1.0;

function get_scale() {
  if (window.innerWidth/window.innerHeight < background.width/background.height) {
    return 0.98 * (window.innerWidth/background.width);
  } else {
    return 0.98 * (window.innerHeight/background.height);
  }
}

function resize() {
  scale = get_scale();
  canvas.width = scale * background.width;
  canvas.height = scale * background.height;
}

function init() {
  background.src = "nebula_blue.f2014.png";
  spaceship.src = "double_ship.png";
  asteroid.src = "asteroid_blue.png";
  splash.src = "splash.png";
  missile.src = "shot2.png";
  explosion.src = "explosion_alpha.png";
  debris.src = "debris2_blue.png";
  background.addEventListener("load", (event) => {
    resize();
    window.addEventListener("resize", resize);
    window.requestAnimationFrame(loop);
  });
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
  // spaceship, asteroids, missiles...
  ctx.drawImage(debris, 0, 0, debris.width, debris.height, 0, 0, canvas.width, canvas.height);
  window.requestAnimationFrame(loop);
}


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
// document.addEventListener('keydown', (event) => key_listener(true,  event));
// document.addEventListener('keyup',   (event) => key_listener(false, event));

