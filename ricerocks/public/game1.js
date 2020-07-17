"use strict";

// Global Image assets
const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");
const background = new Image();
const spaceship = new Image();
const asteroid = new Image();
const explosion = new Image();
const splash = new Image();
const missile = new Image();
const debris = new Image();
background.src = "nebula_blue.f2014.png";
spaceship.src = "double_ship.png";
asteroid.src = "asteroid_blue.png";
splash.src = "splash.png";
missile.src = "shot2.png";
explosion.src = "explosion_alpha.png";
debris.src = "debris2_blue.png";

// Global Audio assets
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const soundtrack = audioCtx.createBufferSource();
const thrust_sound = audioCtx.createBufferSource();
const missile_sound = audioCtx.createBufferSource();
const explosion_sound = audioCtx.createBufferSource();
loadSound("soundtrack.ogg", soundtrack); 
loadSound("thrust.ogg", thrust_sound);
loadSound("missile.ogg", missile_sound);
loadSound("explosion.ogg", explosion_sound);
soundtrack.loop = true;
soundtrack.connect(audioCtx.destination);
soundtrack.start();

// Global state variables
const inputStates = {loaded: true, thrust: false};
let sprites = [];
let new_sprites = [];
let scale = 1.0;
let lives = 3;
let score = 0;


function loadSound(url, audioNode) {
  fetch(url)
  .then((response) => response.arrayBuffer())
  .then((buffer) => audioCtx.decodeAudioData(buffer))
  .then((decodedData) => audioNode.buffer = decodedData);
}

function playSound(audioNode) {
  const sound = audioCtx.createBufferSource();
  sound.buffer = audioNode.buffer;
  sound.connect(audioCtx.destination);
  sound.start();
  return sound;
}

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
  ctx.fillStyle = "white";
  ctx.font = scale * 22 + "px monospace";
  /* Doesn't work
  sprites.forEach(sprite => {
    sprite.x_centre = scale * sprite.x_centre;
    sprite.y_centre = scale * sprite.y_centre;
  });
  */
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function collision(x1, y1, r1, x2, y2, r2) {
  return distance(x1, y1, x2, y2) <= scale * (r1 + r2);
}

function spaceship_pos() {
  const lst = sprites.filter((sprite) => sprite.type === "spaceship" || sprite.was === "spaceship");
  return [lst[0].x_centre, lst[0].y_centre, lst[0].radius];
}

function random_distance(r2) {
  let [x1, y1, r1] = spaceship_pos(); 
  let x2;
  let y2;
  do {
    x2 = Math.floor(Math.random() * (canvas.width + 1));
    y2 = Math.floor(Math.random() * (canvas.height + 1));
  } while (distance(x1, y1, x2, y2) < 1.5 * scale * (r1 + r2));
  return [x2, y2];
}

function create(tp, im, w, h, rw, col, x, y, rad, v, d, a, av, t, l) { 
  return { type: tp
         , image: im
         , width: w
         , height: h
         , row: rw
         , column: col
         , x_centre: x
         , y_centre: y
         , radius: rad
         , velocity: v
         , direction: d
         , angle: a
         , angular_velocity: av
         , tick: t
         , lifespan: l
         };
}

function create_old(type, sprite=undefined) {
  const obj = { type: type
              , row: 0
              , column: 0
              , tick: 0
              , lifespan: 10
              };
  let x;
  let y;
  let velocity;
  switch (type) {
    case "spaceship":
      obj.image = spaceship;
      obj.width = 90; 
      obj.height = 90;
      obj.radius = 35;
      if (sprite === undefined) {
        obj.x_centre = canvas.width/2;
        obj.y_centre = canvas.height/2;
        obj.x_velocity = 0; 
        obj.y_velocity = 0;
        obj.angle = -Math.PI/2;
      } else {
        obj.x_centre = sprite.x_centre;
        obj.y_centre = sprite.y_centre;
        obj.x_velocity = sprite.x_velocity;
        obj.y_velocity = sprite.x_velocity;
        obj.angle = sprite.angle;
      }
      return obj;
    case "asteroid":
      obj.radius = 40;
      [x, y] = random_distance(obj.radius);
      obj.angle = Math.random() * 2 * Math.PI;
      obj.image = asteroid;
      obj.width = 90; 
      obj.height = 90;
      obj.x_centre = x;
      obj.y_centre = y;
      velocity = scale * (Math.random() - 0.5);
      obj.x_velocity = velocity * Math.cos(obj.angle);
      obj.y_velocity = velocity * Math.sin(obj.angle);
      obj.angle_velocity = velocity * Math.PI/90;
      return obj;
    case "missile":
     obj.image = missile;
     obj.width = 10; 
     obj.height = 10;
     obj.x_centre = sprite.x_centre + (scale * sprite.height/2 * Math.cos(sprite.angle));
     obj.y_centre = sprite.y_centre + (scale * sprite.height/2 * Math.sin(sprite.angle));
     obj.x_velocity = sprite.x_velocity + (4 * scale * Math.cos(sprite.angle));
     obj.y_velocity = sprite.y_velocity + (4 * scale * Math.sin(sprite.angle));
     obj.angle = sprite.angle;
     obj.radius = 3;
     obj.tick = 0;
     obj.lifespan = 120;
     return obj;
    case "explosion":
      obj.was = sprite.type;
      obj.image = explosion;
      obj.width = 128;
      obj.height = 128;
      obj.x_centre = sprite.x_centre;
      obj.y_centre = sprite.y_centre;
      obj.x_velocity = sprite.x_velocity;
      obj.y_velocity = sprite.x_velocity;
      obj.angle = sprite.angle;
      obj.tick = 0;
      if (sprite.type === "spaceship") {
        obj.lifespan = 120;
        obj.angle_velocity = 0;
      } else {
        obj.lifespan = 60;
        obj.angle_velocity = sprite.angle_velocity;
      }
      return obj;
  }
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
      return sprite;
    case "asteroid":
      update_asteroid(sprite);
      return sprite;
    case "missile":
      update_missile(sprite);
      return sprite;
    case "explosion":
      update_explosion(sprite);
      return sprite;
    default:
      return sprite;
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
    spaceship.angle = spaceship.angle + Math.PI/60;
  } 
  if (inputStates.left) {
    spaceship.angle = spaceship.angle - Math.PI/60;
  }
  if (inputStates.space && inputStates.loaded) {
    new_sprites.push(create_old("missile", spaceship));
    // recoil
    spaceship.x_velocity = spaceship.x_velocity - (0.05 * scale * Math.cos(spaceship.angle));
    spaceship.y_velocity = spaceship.y_velocity - (0.05 * scale * Math.sin(spaceship.angle));
    inputStates.loaded = false;
  }
  const hitlist = sprites.filter((sprite) => sprite.type === "asteroid" && 
    collision(spaceship.x_centre, spaceship.y_centre, spaceship.radius,
              sprite.x_centre, sprite.y_centre, sprite.radius));
  if (hitlist.length > 0) {
    if (inputStates.thrust === true) {
      inputStates.thrust_sound.stop();
      inputStates.thrust = false;
    }
    playSound(explosion_sound);
    lives = lives - 1;
    spaceship.tick = spaceship.lifespan;
    new_sprites.push(create_old("explosion", spaceship));
    hitlist.forEach(function (asteroid) {
      asteroid.tick = asteroid.lifespan;
      new_sprites.push(create_old("explosion", asteroid));
    });
  }
}

function update_asteroid(asteroid) {
  asteroid.x_centre = asteroid.x_centre + asteroid.x_velocity;
  asteroid.y_centre = asteroid.y_centre + asteroid.y_velocity;
  asteroid.angle = asteroid.angle + asteroid.angle_velocity;
  const hitlist = sprites.filter((sprite) => sprite.type === "missile" && 
    collision(asteroid.x_centre, asteroid.y_centre, asteroid.radius,
              sprite.x_centre, sprite.y_centre, sprite.radius));
  if (hitlist.length > 0) {
    playSound(explosion_sound);
    score = score + 1;
    asteroid.tick = asteroid.lifespan;
    new_sprites.push(create_old("explosion", asteroid));
    hitlist.forEach((missile) => missile.tick = missile.lifetime);
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
  explosion.column = Math.floor((explosion.tick/explosion.lifespan) * 24);
  explosion.tick = explosion.tick + 1;
  if (explosion.tick === explosion.lifespan) {
    switch (explosion.was) {
      case "asteroid":
        new_sprites.push(create_old("asteroid"));
        break;
      case "spaceship":
        new_sprites.push(create_old("spaceship", explosion));
        break;
    }
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
  new_sprites = [];
  sprites.forEach(function (sprite) {draw(sprite); update_sprite(sprite)});
  // sprites = sprites.map((sprite) => update_sprite(sprite));
  sprites = sprites.filter((sprite) => sprite.tick < sprite.lifespan);
  sprites = sprites.concat(new_sprites);
  ctx.drawImage(debris, 0, 0, debris.width, debris.height, 0, 0, canvas.width, canvas.height);
  ctx.fillText("Lives", scale * 50, scale * 50);
  ctx.fillText("Score", scale * 680, scale * 50);
  ctx.fillText(lives, scale * 50, scale * 80);
  ctx.fillText(score, scale * 680, scale * 80);
  window.requestAnimationFrame(loop);
}

function init() {
  background.addEventListener("load", function (event) {
    resize();
    sprites.push(create("spaceship", spaceship, 90, 90, 0, 0, 
      canvas.width/2, canvas.height/2, 
      35, 0, 0, -Math.PI/2, 0, 0, Infinity));
    for (let rock = 0; rock <= 12; rock ++) { 
      sprites.push(create_old("asteroid"));
    }
    window.addEventListener("resize", resize);
    window.requestAnimationFrame(loop);
  });
}

function keyListener(event) {
  let bool;
  switch (event.type) {
    case "keydown":
      bool = true;
      break;
    case "keyup":
      bool = false;
      break;
  }
  switch (event.key) {
    case "ArrowLeft":
      inputStates.left = bool;
      return;
    case "ArrowRight":
      inputStates.right = bool;
      return;
    case "ArrowUp":
      inputStates.up = bool;
      if (inputStates.up && !inputStates.thrust) {
        inputStates.thrust_sound = playSound(thrust_sound);
        inputStates.thrust = true;
      }
      if (!inputStates.up && inputStates.thrust) {
        inputStates.thrust_sound.stop()
        inputStates.thrust = false;
      }
      return;
    case " ":
      inputStates.space = bool;
      if (inputStates.space && inputStates.loaded) {
        playSound(missile_sound);
      }
      if (!inputStates.space) {
        inputStates.loaded = true;
      }
      return;
    case "F12":  // allows toggling to debug screen, needs mouseclick for game to regain keyboard.
      event.target.dispatchEvent(event);
      return;
    default:
      event.preventDefault();
      return;
  }
}

window.addEventListener("DOMContentLoaded", init);
document.addEventListener("keydown", (event) => keyListener(event));
document.addEventListener("keyup",   (event) => keyListener(event));




