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
const inputStates = {};
const sprite_list = [];

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
  /* Doesn't work
  sprite_list.forEach(sprite => {
    sprite.x_centre = scale * sprite.x_centre;
    sprite.y_centre = scale * sprite.y_centre;
  });
  */
}

function draw_sprite(sprite) {
  ctx.save();
  ctx.translate(sprite.x_centre, sprite.y_centre);
  ctx.rotate(sprite.angle);
  ctx.drawImage(sprite.image, sprite.column * sprite.width, sprite.row * sprite.height, 
    sprite.width, sprite.height, 
    -(scale * sprite.width)/2, -(scale * sprite.height)/2, 
    scale * sprite.width, scale * sprite.height);
  ctx.restore();
}

function update_sprite(sprite) {
  switch (sprite.type) {
    case "spaceship":
      if (inputStates.up) {
        sprite.column = 1;
      } else {
        sprite.column = 0;
      }
      if (inputStates.right) {
        sprite.angle = sprite.angle + Math.PI/120;  // + clockwise
      } 
      if (inputStates.left) {
        sprite.angle = sprite.angle - Math.PI/120;  // + clockwise
      }
      /*
      if (inputStates.space) {
        my_ship.shoot();
      } else {
        my_ship.loaded = true;
      }
      */
      break;
    case "asteroid":
      // sprite.angle = sprite.angle - Math.PI/120;
      break;
    default:
      // sprite.angle = sprite.angle - Math.PI/120;
  }
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
    sprite_list.unshift({ type: "spaceship"
                        , image: spaceship
                        , width: 90, height: 90
                        , x_centre: canvas.width/2, y_centre: canvas.height/2
                        , row: 0
                        , column: 0 // 1 for burn
                        , angle: -Math.PI/2 // facing up
                        });
    window.addEventListener("resize", resize);
    window.requestAnimationFrame(loop);
  });
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
  // spaceship, asteroids, missiles...
  sprite_list.forEach(sprite => {draw_sprite(sprite); update_sprite(sprite);});
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
    case "F12":  // allows togling to debug screen, needs mouseclick for game to regain keyboard.
      document.dispatchEvent(event);
      break;
    default:
      event.preventDefault();
  }
}

window.addEventListener("DOMContentLoaded", init);
document.addEventListener('keydown', (event) => key_listener(true,  event));
document.addEventListener('keyup',   (event) => key_listener(false, event));

