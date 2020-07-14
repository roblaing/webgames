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
const inputStates = {loaded: true};
let sprites = [];
let new_sprites = [];
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
  /* Doesn't work
  sprites.forEach(sprite => {
    sprite.x_centre = scale * sprite.x_centre;
    sprite.y_centre = scale * sprite.y_centre;
  });
  */
}

function collision(x1, y1, r1, x2, y2, r2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) <= r1 + r2;
}

function spawn_asteroid() {
  let x = Math.floor(Math.random() * (canvas.width + 1));
  let y = Math.floor(Math.random() * (canvas.height + 1));
  let ang = Math.random() * 2 * Math.PI;
  let vel = Math.random() - 0.5;
  return { type: "asteroid"
         , image: asteroid
         , width: 90, height: 90
         , x_centre: x
         , y_centre: y
         , x_velocity: vel * Math.cos(ang)
         , y_velocity: vel * Math.sin(ang)
         , row: 0
         , column: 0
         , angle: ang
         , angle_velocity: vel * Math.PI/90
         , radius: 35
         };
}

function draw(sprite) {
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
  // space is toroidal
  if (sprite.x_centre < 0) {
    sprite.x_centre = canvas.width;
  }
  if (sprite.x_centre > canvas.width) {
    sprite.x_centre = 0;
  }
  if (sprite.y_centre < 0) {
    sprite.y_centre = canvas.height;
  }
  if (sprite.y_centre > canvas.height) {
    sprite.y_centre = 0;
  }
  switch (sprite.type) {
    case "spaceship":
      update_spaceship(sprite);
      break;
    case "asteroid":
      update_asteroid(sprite);
      break;
    case "missile":
      update_missile(sprite);
      break;
    case "explosion":
      update_explosion(sprite);
      break;
    default:
      // sprite.angle = sprite.angle - Math.PI/120;
  }
}

function update_spaceship(spaceship) {
  spaceship.x_centre = spaceship.x_centre + spaceship.x_velocity;
  spaceship.y_centre = spaceship.y_centre + spaceship.y_velocity;
  if (inputStates.up) {
    spaceship.column = 1;
    spaceship.x_velocity = spaceship.x_velocity + (0.1 * scale * Math.cos(spaceship.angle));
    spaceship.y_velocity = spaceship.y_velocity + (0.1 * scale * Math.sin(spaceship.angle));
  } else {
    spaceship.column = 0;
  }
  if (inputStates.right) {
    spaceship.angle = spaceship.angle + Math.PI/90;
  } 
  if (inputStates.left) {
    spaceship.angle = spaceship.angle - Math.PI/90;
  }
  if (inputStates.space && inputStates.loaded) {
    new_sprites.push({ type: "missile"
                     , image: missile
                     , width: 10, height: 10
                     , x_centre: spaceship.x_centre + (scale * spaceship.height/2 * Math.cos(spaceship.angle))
                     , y_centre: spaceship.y_centre + (scale * spaceship.height/2 * Math.sin(spaceship.angle))
                     , x_velocity: spaceship.x_velocity + (4 * scale * Math.cos(spaceship.angle))
                     , y_velocity: spaceship.y_velocity + (4 * scale * Math.sin(spaceship.angle))
                     , row: 0
                     , column: 0
                     , angle: spaceship.angle
                     , radius: 3
                     , tick: 0
                     , lifespan: 120
                     });
    inputStates.loaded = false;
  }
  if (!inputStates.space) {
    inputStates.loaded = true;
  }
}

function update_asteroid(asteroid) {
  asteroid.x_centre = asteroid.x_centre + asteroid.x_velocity;
  asteroid.y_centre = asteroid.y_centre + asteroid.y_velocity;
  asteroid.angle = asteroid.angle + asteroid.angle_velocity;
  const hitlist = sprites.filter(sprite => sprite.type === "missile" && 
    collision(asteroid.x_centre, asteroid.y_centre, asteroid.radius,
              sprite.x_centre, sprite.y_centre, sprite.radius));
  if (hitlist.length > 0) {
    asteroid.type = "explosion";
    asteroid.image = explosion;
    asteroid.width = 128;
    asteroid.height = 128;
    asteroid.was = "asteroid";
    asteroid.tick = 0;
    asteroid.lifespan = 120;
    hitlist.forEach(missile => missile.tick = missile.lifetime);
  }
}

function update_missile(missile) {
  missile.x_centre = missile.x_centre + (scale * missile.x_velocity);
  missile.y_centre = missile.y_centre + (scale * missile.y_velocity);
  missile.tick = missile.tick + 1;
}

function update_explosion(explosion) {
  explosion.x_centre = explosion.x_centre + (scale * explosion.x_velocity);
  explosion.y_centre = explosion.y_centre + (scale * explosion.y_velocity);
  explosion.angle = explosion.angle + explosion.angle_velocity;
  explosion.tick = explosion.tick + 1;
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
    sprites.push({ type: "spaceship"
                 , image: spaceship
                 , width: 90, height: 90
                 , x_centre: canvas.width/2, y_centre: canvas.height/2
                 , x_velocity: 0, y_velocity: 0
                 , row: 0
                 , column: 0 // 1 for burn
                 , angle: -Math.PI/2 // facing up
                 , radius: 35
                 });
    for (let rock = 0; rock <= 10; rock ++) { 
      sprites.push(spawn_asteroid());
    }
    window.addEventListener("resize", resize);
    window.requestAnimationFrame(loop);
  });
}

function dead(sprite) {
  switch (sprite.type) {
    case "missile":
      if (sprite.tick >= sprite.lifespan) {
        return false;
      } else {
        return true;
      }
    default:
      return true;
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
  new_sprites = [];
  sprites.forEach(sprite => {draw(sprite); update_sprite(sprite);});
  sprites = sprites.filter(sprite => dead(sprite));
  sprites = sprites.concat(new_sprites);
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

