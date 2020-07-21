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
backgroundImage.src = "http://www.seatavern.co.za/nebula_blue.f2014.png";
spaceshipImage.src = "http://www.seatavern.co.za/double_ship.png";
asteroidImage.src = "http://www.seatavern.co.za/asteroid_blue.png";
splashImage.src = "http://www.seatavern.co.za/splash.png";
missileImage.src = "http://www.seatavern.co.za/shot2.png";
explosionImage.src = "http://www.seatavern.co.za/explosion_alpha.png";
debrisImage.src = "http://www.seatavern.co.za/debris2_blue.png";

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
const ROTATE_RATE = 60;
const MISSILE_SPEED = 4;

function loadSound(url, audioNode) {
  fetch(url, {credentials: "include"})
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
    sprite.xCentre = scale * sprite.xCentre;
    sprite.yCentre = scale * sprite.yCentre;
  });
  */
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function collisions(sprite1, type) {
  return sprites.filter((sprite2) => sprite2.type === type &&
    distance(sprite1.xCentre, sprite1.yCentre, sprite2.xCentre, sprite2.yCentre) < 
      (scale * (sprite1.radius + sprite2.radius)));
}

function random_distance(sprite, r2, ratio) {
  let [x1, y1, r1] = [sprites.xCentre, sprites.yCentre, sprites.angle]; 
  let x2;
  let y2;
  do {
    x2 = Math.floor(Math.random() * (canvas.width + 1));
    y2 = Math.floor(Math.random() * (canvas.height + 1));
  } while (distance(x1, y1, x2, y2) < ratio * scale * (r1 + r2));
  return [x2, y2];
}

function createSpaceship() { 
  return { type: "spaceship"
         , image: spaceshipImage
         , width: 90
         , height: 90 
         , row: 0
         , column: 0
         , xCentre: canvas.width/2
         , yCentre: canvas.height/2
         , xDelta: 0
         , yDelta: 0
         , radius: 35
         , angle: -Math.PI/2
         , angular_velocity: 0
         , tick: 0
         , lifespan: Infinity
         };
}

function createAsteroid() {
  const [x, y] = random_distance(sprites[0], 40, 1.5);
  const velocity = scale * (Math.random() - 0.5);
  const direction = Math.random() * 2 * Math.PI;
  return { type: "asteroid"
         , image: asteroidImage
         , width: 90
         , height: 90
         , row: 0
         , column: 0
         , xCentre: x
         , yCentre: y
         , xDelta: velocity * Math.cos(direction)
         , yDelta: velocity * Math.sin(direction)
         , radius: 40
         , angle: Math.random() * 2 * Math.PI
         , angular_velocity: (Math.random() - 0.5) * Math.PI/ROTATE_RATE
         , tick: 0
         , lifespan: Infinity
         };
}

function createMissile(sprite) {
  return { type: "missile"
         , image: missileImage
         , width: 10
         , height: 10
         , row: 0
         , column: 0
         , xCentre: sprite.xCentre + (scale * sprite.height/2 * Math.cos(sprite.angle)) 
         , yCentre: sprite.yCentre + (scale * sprite.height/2 * Math.sin(sprite.angle))
         , xDelta: sprite.xDelta + (scale * MISSILE_SPEED * Math.cos(sprite.angle))
         , yDelta: sprite.yDelta + (scale * MISSILE_SPEED * Math.sin(sprite.angle))
         , radius: 3
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

function unexplode(sprite) {
  switch (sprite.was) {
    case "spaceship":
      sprite.type = "spaceship";
      sprite.image = spaceshipImage;
      sprite.width = 90;
      sprite.height = 90;
      sprite.row = 0;
      sprite.column = 0;
      sprite.tick = 0;
      sprite.lifespan = Infinity;
      return;
    case "asteroid":
      Object.assign(sprite, createAsteroid());
      return;
  }
}

function draw(sprite) {
  ctx.save();
  ctx.translate(sprite.xCentre, sprite.yCentre);
  ctx.rotate(sprite.angle);
  ctx.drawImage(sprite.image, sprite.column * sprite.width, sprite.row * sprite.height, 
    sprite.width, sprite.height, 
    -(scale * sprite.width)/2, -(scale * sprite.height)/2, 
    scale * sprite.width, scale * sprite.height);
  ctx.restore();
}

function nextTick(sprite) {
  let hitlist = [];
  sprite.xCentre += sprite.xDelta;
  sprite.yCentre += sprite.yDelta;
  sprite.angle += sprite.angular_velocity;
  // space is toroidal
  if (sprite.xCentre < 0) {
    sprite.xCentre = canvas.width;
  }
  if (sprite.xCentre > canvas.width) {
    sprite.xCentre = 0;
  }
  if (sprite.yCentre < 0) {
    sprite.yCentre = canvas.height;
  }
  if (sprite.yCentre > canvas.height) {
    sprite.yCentre = 0;
  }
  // specific to type updates
  switch (sprite.type) {
    case "spaceship":
      if (inputStates.isUp) {
        sprite.column = 1;
        sprite.xDelta = sprite.xDelta + (scale * THRUST_SPEED * Math.cos(sprite.angle));
        sprite.yDelta = sprite.yDelta + (scale * THRUST_SPEED * Math.sin(sprite.angle));
      } else {
        sprite.column = 0;
      }
      if (inputStates.isRight) {
        sprite.angular_velocity = Math.PI/ROTATE_RATE;
      } 
      if (inputStates.isLeft) {
        sprite.angular_velocity = -Math.PI/ROTATE_RATE;
      } 
      if (!inputStates.isRight && !inputStates.isLeft) {
        sprite.angular_velocity = 0;
      }
      if (inputStates.isSpace && inputStates.isLoaded) {
        new_sprites.push(createMissile(sprite));
        sprite.xDelta = sprite.xDelta + (scale * RECOIL * Math.cos(sprite.angle));
        sprite.yDelta = sprite.yDelta + (scale * RECOIL * Math.sin(sprite.angle));
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
        unexplode(sprite);
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
  sprites.forEach(function (sprite) {draw(sprite); nextTick(sprite);});
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
    sprites[0] = createSpaceship();
    for (let rock = 1; rock <= 13; rock++) { 
      sprites[rock] = createAsteroid();
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

loadSound("http://www.seatavern.co.za/soundtrack.ogg", backgroundSound); 
loadSound("http://www.seatavern.co.za/thrust.ogg", thrustSound);
loadSound("http://www.seatavern.co.za/missile.ogg", missileSound);
loadSound("http://www.seatavern.co.za/explosion.ogg", explosionSound);
backgroundSound.loop = true;
backgroundSound.connect(audioCtx.destination);
backgroundSound.start();

window.addEventListener("DOMContentLoaded", init);
document.addEventListener("keydown", (event) => keyListener(event));
document.addEventListener("keyup",   (event) => keyListener(event));

