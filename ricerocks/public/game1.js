"use strict";
/**
 * @file A simple arcade game translated to JavaScript from a
 * [Python Mooc]{@link https://www.coursera.org/learn/interactive-python-1} given by Rice University.
 * @author Robert Laing
 */

/**
 * Each Sprite has these 15 common properties
 * @typedef {Object} Sprite
 * @namespace Sprite
 * @property {String} Sprite.type - "spaceship" | "asteroid" | "missile" | "explosion"
 * @property {HTMLImageElement} Sprite.image - initialised and loaded sprite sheet
 * @property {pixels} Sprite.width - pixel width of a sprite tile, which is not necessarily image.width
 * @property {pixels} Sprite.height - pixel height of a sprite tile, which is not necessarily image.height
 * @property {Number} Sprite.row - offset sx is calculated from row * width, ie row = 0 for first tile
 * @property {Number} Sprite.column - offset sy is calculated from column * height, ie column = 0 for first tile
 * @property {pixels} Sprite.xCentre - from 0 in top left corner positive right, horizontal centre co-ordinate of sprite
 * @property {pixels} Sprite.yCentre - from 0 in top left corner positive down, vertical centre co-ordinate of sprite
 * @property {pixels} Sprite.xDelta - Sets horizonal speed of the sprite. xCentre is incremented by xDela each tick
 * @property {pixels} Sprite.yDelta - Sets vertical speed of the sprite. yCentre is incremented by yDelta each tick
 * @property {radians} Sprite.angle - radians to rotate image. -Math.PI/2 is 90 degrees
 * @property {radians} Sprite.angleDelta - increment in radians to angle each tick, clockwise positive
 * @property {Number} Sprite.tick - counter to select sprite tile and measure sprite age
 * @property {Number} Sprite.lifespan - used to filter dead ephemereal sprites
 */

/**
 * Global object used by handlers to message the loop
 * @constant {Object} inputStates
 * @namespace inputStates
 * @property {Boolean} inputStates.isUp - Up arrow pressed or not
 * @property {Boolean} inputStates.isThrust - Don't want to add more rocket noise 60 times a second
 * @property {Boolean} inputStates.isLeft - Left arrow pressed or not
 * @property {Boolean} inputStates.isRight - Right arrow pressed or not
 * @property {Boolean} inputStates.isSpace - Space arrow pressed or not
 * @property {Boolean} inputStates.isLoaded - Space bar needs to be released between missiles
 * @property {AudioBufferSourceNode} inputStates.soundBuffer - Stored to stop rocket noise
 */
const inputStates = { isUp: false
                    , isThrust: false
                    , isLeft: false
                    , isRight: false
                    , isSpace: false
                    , isLoaded: true
                    , soundBuffer: null
                    };

const spritesUpdate = new Worker("sprites-updater.js");

/**
 * [Canvas API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API}
 * @constant {HTMLCanvasElement} canvas
*/
window.canvas = document.querySelector("#board");
/**
 * [Canvas's context]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D}
 * @constant {CanvasRenderingContext2D} ctx
 */
window.ctx = window.canvas.getContext("2d");
/**
 * First image drawn each loop.
 * @constant {HTMLImageElement} backgroundImage
 * @property {pixels} width - 800, canvas.width if scale = 1.0
 * @property {pixels} height - 600, canvas.height if scale = 1.0
 * @property {graphicFile} src - [nebula_blue.f2014.png]{@link http://www.seatavern.co.za/nebula_blue.f2014.png}
 */
window.backgroundImage = new Image();
/**
 * Two images in one file showing spaceship with rocket on or off.
 * @constant {HTMLImageElement} spaceshipImage
 * @property {pixels} width - 180, two square tiles in a row
 * @property {pixels} height - 90
 * @property {graphicFile} src - [double_ship.png]{@link http://www.seatavern.co.za/double_ship.png}
 */
window.spaceshipImage = new Image();
/**
 * Single image with no animation per se, but rotation makes it look lively.
 * @constant {HTMLImageElement} asteroidImage
 * @property {pixels} width - 90
 * @property {pixels} height - 90
 * @property {graphicFile} src - [asteroid_blue.png]{@link http://www.seatavern.co.za/asteroid_blue.png}
 */
window.asteroidImage = new Image();
/**
 * The only animated sprite in this game
 * @constant {HTMLImageElement} asteroidImage
 * @property {pixels} width - 90
 * @property {pixels} height - 90
 */
window.explosionImage = new Image();
window.splashImage = new Image();
window.missileImage = new Image();
window.debrisImage = new Image();
window.backgroundImage.src = "nebula_blue.f2014.png";
window.spaceshipImage.src = "double_ship.png";
window.asteroidImage.src = "asteroid_blue.png";
window.splashImage.src = "splash.png";
window.missileImage.src = "shot2.png";
window.explosionImage.src = "explosion_alpha.png";
window.debrisImage.src = "debris2_blue.png";

// Global Audio assets
window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
window.backgroundSound = audioCtx.createBufferSource();
window.thrustSound = audioCtx.createBufferSource();
window.missileSound = audioCtx.createBufferSource();
window.explosionSound = audioCtx.createBufferSource();

/**
 * An array holding sprites which are currently alive. sprites[0] is the spaceship
 * @type {Array}
 */
window.sprites = [];
window.new_sprites = [];
window.scale = 1.0;
window.lives = 3;
window.score = 0;

// Sprite movement constants
const THRUST_SPEED = 0.1;
const RECOIL = -0.05;
const ROTATE_RATE = 60;
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

function collisions(sprite1, type) {
  return sprites.filter((sprite2) => sprite2.type === type &&
    Math.hypot(sprite1.xCentre - sprite2.xCentre, sprite1.yCentre - sprite2.yCentre) <
      (scale * (sprite1.radius + sprite2.radius)));
}

// https://stackoverflow.com/questions/63197135/intermittent-wrong-answer-from-javascript-float-comparison
function random_distance(sprite, r2, ratio) {
  const x1 = sprite.xCentre + sprite.xDelta;
  const y1 = sprite.yCentre + sprite.yDelta;
  const r1 = sprite.radius;
  const minDistance = ratio * scale * (r1 + r2);
  let x2;
  let y2;
  let d;
  do {
    x2 = Math.random() * (canvas.width + 1);
    y2 = Math.random() * (canvas.height + 1);
    d = Math.hypot(x2 - x1, y2 - y1);
  } while (d < minDistance);
  return [x2, y2];
}

/**
 * Initialises a spaceship Sprite
 * @function
 * @param {HTMLImageElement} spaceshipImage - A global constant, but passed as a parameter to enable mocking in Jasemine
 * @param {HTMLCanvasElement} canvas - A global constant, but passed as a parameter to enable mocking in Jasemine
 * @returns {Sprite} A spaceship starting in the centre, facing up, stationary
 */
function createSpaceship() {
  return { type: "spaceship"
         , image: window.spaceshipImage
         , width: 90
         , height: 90
         , row: 0
         , column: 0
         , xCentre: window.canvas.width/2
         , yCentre: window.canvas.height/2
         , xDelta: 0
         , yDelta: 0
         , radius: 35
         , angle: -Math.PI/2
         , angleDelta: 0
         , tick: 0
         , lifespan: Infinity
         };
}

/**
 * Initialises an asteroid Sprite
 * @function
 * @returns {Sprite} Selects random start (not on top of spaceship), speed and rotation
 */
function createAsteroid() {
  let [x, y] = random_distance(sprites[0], 40, 1.5);
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
         , angleDelta: (Math.random() - 0.5) * Math.PI/ROTATE_RATE
         , tick: 0
         , lifespan: Infinity
         };
}

/**
 * Initialises a missile Sprite, shoots from tip of spaceship
 * @function
 * @param {Sprite} spaceship - needs direction, position and velocity of spaceship
 * @returns {Sprite} Missile shot from spaceship, lives 2 seconds (120 ticks)
 */
function createMissile(spaceship) {
  return { type: "missile"
         , image: missileImage
         , width: 10
         , height: 10
         , row: 0
         , column: 0
         , xCentre: spaceship.xCentre + (scale * spaceship.height/2 * Math.cos(spaceship.angle))
         , yCentre: spaceship.yCentre + (scale * spaceship.height/2 * Math.sin(spaceship.angle))
         , xDelta: spaceship.xDelta + (scale * MISSILE_SPEED * Math.cos(spaceship.angle))
         , yDelta: spaceship.yDelta + (scale * MISSILE_SPEED * Math.sin(spaceship.angle))
         , radius: 3
         , angle: spaceship.angle
         , angleDelta: 0
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

/**
 * Uses five of CanvasRenderingContext2D's many methods
 * @function draw
 * @param {Sprite} sprite The 9 parameters needed by ctx.drawImage, the 2 for ctx.translate, and angle for ctx.rotate
 * @returns {undefined} Causes side-effect of drawing image
 */
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

/**
 * The physics/game engine
 * @function nextTick
 * @param {Sprite} sprite Position and movement parameters to be updated
 * @returns {undefined} Mutates the sprite object
 */
function nextTick(sprite) {
  let hitlist = [];
  sprite.xCentre += sprite.xDelta;
  sprite.yCentre += sprite.yDelta;
  sprite.angle += sprite.angleDelta;
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
        sprite.angleDelta = Math.PI/ROTATE_RATE;
      }
      if (inputStates.isLeft) {
        sprite.angleDelta = -Math.PI/ROTATE_RATE;
      }
      if (!inputStates.isRight && !inputStates.isLeft) {
        sprite.angleDelta = 0;
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

/**
 * The core body of the application
 * @function loop
 * @returns {undefined} Never returning infinite loop
 */
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

/**
 * The resizeListener event handler
 * @function resizeListener
 * @returns {undefined} Mutates the scale global variable
 */
function resizeListener() {
  const oldScale = scale;
  scale = get_scale();
  canvas.width = scale * backgroundImage.width;
  canvas.height = scale * backgroundImage.height;
  ctx.fillStyle = "white";
  ctx.font = scale * 22 + "px monospace";
  sprites.forEach(function (sprite) {
    sprite.xCentre *= scale/oldScale;
    sprite.yCentre *= scale/oldScale;
    sprite.xDelta  *= scale/oldScale;
    sprite.yDelta  *= scale/oldScale;
  });
}

/**
 * The user input event handler
 * @function uiListener
 * @param {KeyboardEvent|PointerEvent} event - Object sent by target.addEventListener(type, uiListener);
 * @returns {undefined} Mutates the inputStates global object
 * @property {DOMString} event.type - Inherited from [Event]{@link https://developer.mozilla.org/en-US/docs/Web/API/Event#Properties}
 * @property {DOMString} event.key - A [Key Value]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values}
 * @property {DOMString} event.target - document since that's what called this function
 */
function uiListener(event) {
  const button2key = { "leftButton": "ArrowLeft"
                     , "rightButton": "ArrowRight"
                     , "upButton": "ArrowUp"
                     , "spaceBar": " "
                     };
  let bool;
  let key;
  switch (event.type) {
    case "keydown":
      bool = true;
      key = event.key;
      break;
    case "keyup":
      bool = false;
      key = event.key;
      break;
    case "pointerdown":
      bool = true;
      key = button2key[event.target.id];
      break;
    case "pointerup":
      bool = false;
      key = button2key[event.target.id];
      break;
  }
  switch (key) {
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
        inputStates.soundBuffer.stop();
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

async function setup(event1) {
  await backgroundImage.addEventListener("load", function (event2) {
    resizeListener();
    sprites[0] = createSpaceship();
    for (let rock = 1; rock <= 13; rock++) {
      sprites[rock] = createAsteroid();
    }
    window.requestAnimationFrame(loop);
  });
}

function cleanup(event) {
  backgroundSound.stop();
  thrustSound.stop();
  missileSound.stop();
  explosionSound.stop();
}

window.addEventListener("DOMContentLoaded", setup);
window.addEventListener("unload", cleanup);
window.addEventListener("resize", resizeListener);

loadSound("soundtrack.ogg", backgroundSound);
loadSound("thrust.ogg", thrustSound);
loadSound("missile.ogg", missileSound);
loadSound("explosion.ogg", explosionSound);
backgroundSound.loop = true;
backgroundSound.connect(audioCtx.destination);
backgroundSound.start();

document.addEventListener("keydown", uiListener);
document.addEventListener("keyup", uiListener);
document.querySelector("#upButton").addEventListener("pointerdown", uiListener);
document.querySelector("#upButton").addEventListener("pointerup", uiListener);
document.querySelector("#leftButton").addEventListener("pointerdown", uiListener);
document.querySelector("#leftButton").addEventListener("pointerup", uiListener);
document.querySelector("#rightButton").addEventListener("pointerdown", uiListener);
document.querySelector("#rightButton").addEventListener("pointerup", uiListener);
document.querySelector("#spaceBar").addEventListener("pointerdown", uiListener);
document.querySelector("#spaceBar").addEventListener("pointerup", uiListener);
spritesUpdate.addEventListener("message", spritesUpdateListener);

