"use strict";

// Global Image assets
const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");
const backgroundImage = new Image();
const spaceshipImage = new Image();
const asteroidImage = new Image();
const explosionImage = new Image();
const splashImage = new Image();
const missileImage = new Image();
const debrisImage = new Image();
backgroundImage.src = "nebula_blue.f2014.png";
spaceshipImage.src = "double_ship.png";
asteroidImage.src = "asteroid_blue.png";
splashImage.src = "splash.png";
missileImage.src = "shot2.png";
explosionImage.src = "explosion_alpha.png";
debrisImage.src = "debris2_blue.png";

// Global Audio assets
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const backgroundSound = audioCtx.createBufferSource();
const thrustSound = audioCtx.createBufferSource();
const missileSound = audioCtx.createBufferSource();
const explosionSound = audioCtx.createBufferSource();

// Global state variables
const inputStates = {isLoaded: true, isThrust: false};
let sprites = [];
let new_sprites = [];
let scale = 1.0;
let lives = 3;
let score = 0;

// Sprite movement constants
const THRUST_SPEED = 0.1;
const RECOIL = -0.05;
const SPACESHIP_ROTATE_RATE = 60;
const ASTEROID_ROTATE_RATE = 90;
const MISSILE_SPEED = 4;

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
  if (window.innerWidth/window.innerHeight < backgroundImage.width/backgroundImage.height) {
    return 0.98 * (window.innerWidth/backgroundImage.width);
  } else {
    return 0.98 * (window.innerHeight/backgroundImage.height);
  }
}

function resize() {
  scale = get_scale();
  canvas.width = scale * backgroundImage.width;
  canvas.height = scale * backgroundImage.height;
  ctx.fillStyle = "white";
  ctx.font = scale * 22 + "px monospace";
  /* Doesn't work
  sprites.forEach(sprite => {
    sprite.x_centre = scale * sprite.x_centre;
    sprite.y_centre = scale * sprite.y_centre;
  });
  */
}

function polar(sprite, speed) {
  let dir;
  const x_vel = (sprite.velocity * Math.cos(sprite.direction) + 
    (scale * speed * Math.cos(sprite.angle)));
  const y_vel = (sprite.velocity * Math.sin(sprite.direction) + 
    (scale * speed * Math.sin(sprite.angle)));
  const vel = Math.sqrt(Math.pow(x_vel, 2) + Math.pow(y_vel, 2));
  if (x_vel >= 0) {
    dir = Math.asin(y_vel/vel);   // quadrant 1 & 4
  }
  if (x_vel < 0 && y_vel < 0) {
    dir = Math.atan(y_vel/x_vel) - Math.PI;  // quadrant 2
  }
  if (x_vel < 0 && y_vel > 0) {
    dir = Math.acos(x_vel/vel);  // quadrant 3
  }
  return [vel, dir];
}

function collisions(sprite1, type) {
  return sprites.filter((sprite2) => sprite2.type === type &&
    Math.sqrt(Math.pow(sprite2.x_centre - sprite1.x_centre, 2) + 
              Math.pow(sprite2.y_centre - sprite2.y_centre, 2)) < 
      scale * (sprite1.radius + sprite2.radius));
}

// still needed?
function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
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

function createSpaceship() { 
  return { type: "spaceship"
         , image: spaceshipImage
         , width: 90
         , height: 90 
         , row: 0
         , column: 0
         , x_centre: canvas.width/2
         , y_centre: canvas.height/2
         , radius: 35
         , velocity: 0
         , direction: -Math.PI/2
         , angle: -Math.PI/2
         , angular_velocity: 0
         , tick: 0
         , lifespan: Infinity
         };
}

function createAsteroid() {
  const [x, y] = random_distance(40);
  return { type: "asteroid"
         , image: asteroidImage
         , width: 90
         , height: 90
         , row: 0
         , column: 0
         , x_centre: x
         , y_centre: y
         , radius: 40
         , velocity: scale * (Math.random() - 0.5)
         , direction:  Math.random() * 2 * Math.PI
         , angle: Math.random() * 2 * Math.PI
         , angular_velocity: (Math.random() - 0.5) * Math.PI/ASTEROID_ROTATE_RATE
         , tick: 0
         , lifespan: Infinity
         };
}

function createMissile(sprite) {
  const [vel, dir] = polar(sprite, MISSILE_SPEED);
  return { type: "missile"
         , image: missileImage
         , width: 10
         , height: 10
         , row: 0
         , column: 0
         , x_centre: sprite.x_centre + (scale * sprite.height/2 * Math.cos(sprite.angle)) 
         , y_centre: sprite.y_centre + (scale * sprite.height/2 * Math.sin(sprite.angle))
         , radius: 3
         , velocity: vel
         , direction: dir
         , angle: sprite.angle
         , angular_velocity: 0
         , tick: 0
         , lifespan: 120
         };
}

function explode(sprite, lifespan) {
  sprite.was = sprite.type;
  sprite.type = "explosion";
  sprite.image = explosionImage;
  sprite.width = 128;
  sprite.height = 128;
  sprite.row = 0;
  sprite.column = 0;
  sprite.tick = 0;
  sprite.lifespan = lifespan;
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

function update(sprite) {
  let hitlist = [];
  let velocity;
  let direction;
  // increment linear and angular positions
  sprite.x_centre += sprite.velocity * Math.cos(sprite.direction);
  sprite.y_centre += sprite.velocity * Math.sin(sprite.direction);
  sprite.angle += sprite.angular_velocity;
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
  // specific to type updates
  switch (sprite.type) {
    case "spaceship":
      if (inputStates.isUp) {
        sprite.column = 1;
        [velocity, direction] = polar(sprite, THRUST_SPEED);
        sprite.velocity = velocity;
        sprite.direction = direction;
      } else {
        sprite.column = 0;
      }
      if (inputStates.isRight) {
        sprite.angular_velocity = Math.PI/SPACESHIP_ROTATE_RATE;
      } 
      if (inputStates.isLeft) {
        sprite.angular_velocity = -Math.PI/SPACESHIP_ROTATE_RATE;
      } 
      if (!inputStates.isRight && !inputStates.isLeft) {
        sprite.angular_velocity = 0;
      }
      if (inputStates.isSpace && inputStates.isLoaded) {
        new_sprites.push(createMissile(sprite));
        [velocity, direction] = polar(sprite, RECOIL);
        sprite.velocity = velocity;
        sprite.direction = direction;
        inputStates.isLoaded = false;
      }
      hitlist = collisions(sprite, "asteroid");
      if (hitlist.length > 0) {
        if (inputStates.isThrust === true) {
          inputStates.soundBuffer.stop();
          inputStates.isThrust = false;
        }
        playSound(explosionSound);
        lives--;
        explode(sprite, 30);
        hitlist.forEach((sprite2) => explode(sprite2, 120));
      }
      return;
    case "asteroid":
      hitlist = collisions(sprite, "missile");
      if (hitlist.length > 0) {
        playSound(explosionSound);
        score++;
        hitlist[0].tick = hitlist[0].lifespan; // only the first missileImage kills and gets killed
        explode(sprite, 60);
      }
      return;
    case "explosion":
      sprite.column = Math.floor((sprite.tick/sprite.lifespan) * 24);
      if ((sprite.lifespan - 1) === sprite.tick) {
        if (sprite.was === "spaceship") {
          sprite.type = "spaceship";
          sprite.image = spaceshipImage;
          sprite.width = 90;
          sprite.height = 90;
          sprite.row = 0;
          sprite.column = 0;
          sprite.tick = 0;
          sprite.lifespan = Infinity;
        }
        if (sprite.was === "asteroid") {
          new_sprites.push(createAsteroid());
        }
      }
      sprite.tick++;
      return;
    case "missile":
      sprite.tick++;
      return;
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, backgroundImage.width, backgroundImage.height, 0, 0, canvas.width, canvas.height);
  new_sprites = [];
  sprites.forEach(function (sprite) {draw(sprite); update(sprite);});
  sprites = sprites.filter((sprite) => sprite.tick < sprite.lifespan);
  sprites = sprites.concat(new_sprites);
  ctx.drawImage(debrisImage, 0, 0, debrisImage.width, debrisImage.height, 0, 0, canvas.width, canvas.height);
  ctx.fillText("Lives", scale * 50, scale * 50);
  ctx.fillText("Score", scale * 680, scale * 50);
  ctx.fillText(lives, scale * 50, scale * 80);
  ctx.fillText(score, scale * 680, scale * 80);
  window.requestAnimationFrame(loop);
}

function init() {
  backgroundImage.addEventListener("load", function (event) {
    resize();
    sprites.push(createSpaceship());
    for (let rock = 0; rock <= 12; rock++) { 
      sprites.push(createAsteroid());
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
      inputStates.isLeft = bool;
      return;
    case "ArrowRight":
      inputStates.isRight = bool;
      return;
    case "ArrowUp":
      inputStates.isUp = bool;
      if (inputStates.isUp && !inputStates.isThrust) {
        inputStates.soundBuffer = playSound(thrustSound);
        inputStates.isThrust = true;
      }
      if (!inputStates.isUp && inputStates.isThrust) {
        inputStates.soundBuffer.stop()
        inputStates.isThrust = false;
      }
      return;
    case " ":
      inputStates.isSpace = bool;
      if (inputStates.isSpace && inputStates.isLoaded) {
        playSound(missileSound);
      }
      if (!inputStates.isSpace) {
        inputStates.isLoaded = true;
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

loadSound("soundtrack.ogg", backgroundSound); 
loadSound("thrust.ogg", thrustSound);
loadSound("missile.ogg", missileSound);
loadSound("explosion.ogg", explosionSound);
backgroundSound.loop = true;
backgroundSound.connect(audioCtx.destination);
backgroundSound.start();

window.addEventListener("DOMContentLoaded", init);
document.addEventListener("keydown", (event) => keyListener(event));
document.addEventListener("keyup",   (event) => keyListener(event));

