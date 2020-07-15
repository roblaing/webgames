"use strict";

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");
const background = new Image();
const spaceship = new Image();
const asteroid = new Image();
const explosion = new Image();
const splash = new Image();
const missile = new Image();
const debris = new Image();
const audio_ctx = new window.AudioContext() || new window.webkitAudioContext();
const soundtrack = audio_ctx.createBufferSource();
const thrust_sound = audio_ctx.createBufferSource();
const missile_sound = audio_ctx.createBufferSource();
const explosion_sound = audio_ctx.createBufferSource();
const inputStates = {loaded: true, thrust: false};
let sprites = [];
let new_sprites = [];
let scale = 1.0;
let lives = 3;
let score = 0;

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

function collision(x1, y1, r1, x2, y2, r2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) <= scale * (r1 + r2);
}

function create_spaceship(x, y, ang) {
  return { type: "spaceship"
         , image: spaceship
         , width: 90, height: 90
         , x_centre: x
         , y_centre: y
         , x_velocity: 0, y_velocity: 0
         , row: 0
         , column: 0 // 1 for burn
         , angle: ang
         , radius: 35
         };
}

function create_asteroid() {
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
         , radius: 40
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

function play_sound(audio_node) {
  const sound = audio_ctx.createBufferSource();
  sound.buffer = audio_node.buffer;
  sound.connect(audio_ctx.destination);
  sound.start();
  return sound;
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
      return;
    case "asteroid":
      update_asteroid(sprite);
      return;
    case "missile":
      update_missile(sprite);
      return;
    case "explosion":
      update_explosion(sprite);
      return;
    default:
      return;
  }
}

function update_spaceship(spaceship) {
  spaceship.x_centre = spaceship.x_centre + spaceship.x_velocity;
  spaceship.y_centre = spaceship.y_centre + spaceship.y_velocity;
  if (inputStates.up) {
    if (inputStates.thrust === false) {
      spaceship.sound = play_sound(thrust_sound);
      inputStates.thrust = true;
    }
    spaceship.column = 1;
    spaceship.x_velocity = spaceship.x_velocity + (0.1 * scale * Math.cos(spaceship.angle));
    spaceship.y_velocity = spaceship.y_velocity + (0.1 * scale * Math.sin(spaceship.angle));
  } else {
    spaceship.column = 0;
    if (inputStates.thrust === true) {
      spaceship.sound.stop();
      inputStates.thrust = false;
    }
  }
  if (inputStates.right) {
    spaceship.angle = spaceship.angle + Math.PI/60;
  } 
  if (inputStates.left) {
    spaceship.angle = spaceship.angle - Math.PI/60;
  }
  if (inputStates.space && inputStates.loaded) {
    play_sound(missile_sound);
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
  const hitlist = sprites.filter((sprite) => sprite.type === "asteroid" && 
    collision(spaceship.x_centre, spaceship.y_centre, spaceship.radius,
              sprite.x_centre, sprite.y_centre, sprite.radius));
  if (hitlist.length > 0) {
    if (inputStates.thrust === true) {
      spaceship.sound.stop();
      inputStates.thrust = false;
    }
    play_sound(explosion_sound);
    lives = lives - 1;
    spaceship.type = "explosion";
    spaceship.image = explosion;
    spaceship.width = 128;
    spaceship.height = 128;
    spaceship.was = "spaceship";
    spaceship.tick = 0;
    spaceship.lifespan = 120;
    spaceship.angle_velocity = 0;
    hitlist.forEach(function (asteroid) { 
      asteroid.type = "explosion";
      asteroid.image = explosion;
      asteroid.width = 128;
      asteroid.height = 128;
      asteroid.was = "asteroid";
      asteroid.tick = 0;
      asteroid.lifespan = 60;
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
    play_sound(explosion_sound);
    score = score + 1;
    asteroid.type = "explosion";
    asteroid.image = explosion;
    asteroid.width = 128;
    asteroid.height = 128;
    asteroid.was = "asteroid";
    asteroid.tick = 0;
    asteroid.lifespan = 60;
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
        new_sprites.push(create_asteroid());
        break;
      case "spaceship":
        new_sprites.push(create_spaceship(explosion.x_centre, explosion.y_centre, explosion.angle));
        break;
    }
  }
}

function load_play_sound(url, audio_node) {
  let xhr2;
  xhr2 = new XMLHttpRequest();
  xhr2.open("GET", url, true);
  xhr2.responseType = "arraybuffer";
  xhr2.onload = function () {
    audio_ctx.decodeAudioData(xhr2.response, function (buffer) {
      audio_node.buffer = buffer;
      if (audio_node === soundtrack) {
        soundtrack.loop = true;
        soundtrack.connect(audio_ctx.destination);
        soundtrack.start();        
      }
    });
  };
  xhr2.send();
}

function dead(sprite) {
  switch (sprite.type) {
    case "missile":
      return sprite.tick < sprite.lifespan;
    case "explosion":
      return sprite.tick < sprite.lifespan;
    default:
      return true;
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
  new_sprites = [];
  sprites.forEach(function (sprite) {draw(sprite); update_sprite(sprite);});
  sprites = sprites.filter(sprite => dead(sprite));
  sprites = sprites.concat(new_sprites);
  ctx.drawImage(debris, 0, 0, debris.width, debris.height, 0, 0, canvas.width, canvas.height);
  ctx.fillText("Lives", scale * 50, scale * 50);
  ctx.fillText("Score", scale * 680, scale * 50);
  ctx.fillText(lives, scale * 50, scale * 80);
  ctx.fillText(score, scale * 680, scale * 80);
  window.requestAnimationFrame(loop);
}

function key_listener(event) {
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
    case "ArrowUp":
      inputStates.up = bool;
      return;
    case "ArrowRight":
      inputStates.right = bool;
      return;
    case " ":
      inputStates.space = bool;
      return;
    case "F12":  // allows toggling to debug screen, needs mouseclick for game to regain keyboard.
      event.target.dispatchEvent(event);
      return;
    default:
      event.preventDefault();
      return;
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
  load_play_sound("soundtrack.ogg", soundtrack); 
  load_play_sound("thrust.ogg", thrust_sound);
  load_play_sound("missile.ogg", missile_sound);
  load_play_sound("explosion.ogg", explosion_sound);
  background.addEventListener("load", function (event) {
    resize();
    sprites.push(create_spaceship(canvas.width/2, canvas.height/2, -Math.PI/2));
    for (let rock = 0; rock <= 12; rock ++) { 
      sprites.push(create_asteroid());
    }
    window.addEventListener("resize", resize);
    window.requestAnimationFrame(loop);
  });
}

window.addEventListener("DOMContentLoaded", init);
document.addEventListener("keydown", (event) => key_listener(event));
document.addEventListener("keyup",   (event) => key_listener(event));

