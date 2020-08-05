/**
 * @file A simple arcade game translated to JavaScript from a
 * [Python Mooc]{@link https://www.coursera.org/learn/interactive-python-1} given by Rice University.
 * @author Robert Laing
 * @requires rice-rocks.js
 */

import { canvas, images, draw, clearScene, paintScene, scaleText, writeText } from "./image.js";
import { sounds, playSound } from "./sound.js";

/**
 * Each Sprite has these 15 common properties
 * @typedef {Object} Sprite
 * @namespace Sprite
 * @property {String} Sprite.type - "spaceship" | "asteroid" | "missile" | "explosion"
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

const stateWorker = new Worker("state-loop.js");

/**
 * This doubles as the message sent to stateWorker 60 ticks a second
 * @type {Object}
 */
let state = { "type": "tick"
            , "sprites": []
            , "missiles": []
            , "lives": 3
            , "score": 0
            , "width": 800
            , "height": 600
            , "scale": 1.0
            };

let thrustSound;
const BASE_WIDTH = 800;
const BASE_HEIGHT = 600;

/**
 * Move to module so don't have to export ctx or draw?
 * @function animationLoop
 * @returns {undefined} Never returning infinite loop
 */
function animationLoop() {
  clearScene();
  paintScene(images["background"]);
  state.sprites.forEach((sprite) => draw(sprite, state.scale));
  state.missiles.forEach((missile) => draw(missile, state.scale));
  stateWorker.postMessage(state);
  paintScene(images["debris"]);
  writeText(state);
  window.requestAnimationFrame(animationLoop);
}

/**
 * Calculate a ratio to make the canvas larger for big screens, smaller for mobile devices
 * @function getScale
 * @returns {float} Amount to multiply the sizes of images
 * @param {pixels} windowWidth -- originally hardwired to window.innerWidth
 * @param {pixels} windowHeight -- originally hardwired to window.innerHeight
 * @param {pixels} baseWidth -- originally hardwired to backgroundImage.width
 * @param {pixels} baseHeight -- originally hardwired to backgroundImage.height
 */
function getScale(windowWidth, windowHeight, baseWidth, baseHeight) {
  if (windowWidth/windowHeight < baseWidth/baseHeight) {
    return 0.98 * (windowWidth/baseWidth);
  } else {
    return 0.98 * (windowHeight/baseHeight);
  }
}

/**
 * The resizeListener event handler
 * @function resizeListener
 * @returns {undefined} Mutates the scale global variable
 * @param {pixels} windowWidth -- originally hardwired to window.innerWidth
 * @param {pixels} windowHeight -- originally hardwired to window.innerHeight
 * @param {pixels} baseWidth -- originally hardwired to backgroundImage.width
 * @param {pixels} baseHeight -- originally hardwired to backgroundImage.height
 */
function resizeListener(baseWidth, baseHeight, event) {
  const oldScale = state.scale;
  state.scale = getScale(window.innerWidth, window.innerHeight, baseWidth, baseHeight);
  canvas.width = state.scale * baseWidth;
  canvas.height = state.scale * baseHeight;
  state.width = canvas.width;
  state.height = canvas.height;
  scaleText(state.scale);
  state.sprites.forEach(function (sprite) {
    sprite.xCentre *= state.scale/oldScale;
    sprite.yCentre *= state.scale/oldScale;
    sprite.xDelta  *= state.scale/oldScale;
    sprite.yDelta  *= state.scale/oldScale;
  });
}

/**
 * The user input event handler
 * @function uiListener
 * @param {KeyboardEvent|PointerEvent} event - Object sent by target.addEventListener(type, (event) => uiListener(inputStates, event));
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
  if (key === "F12") { // allow debug screen
    event.target.dispatchEvent(event);
    return;
  }
  if (!Object.values(button2key).includes(key)) {  // pressing "non-game" key froze game
    event.preventDefault();
    return;
  }
  stateWorker.postMessage({"type": "inputStates", "key": key, "bool": bool});
}

function cleanup(event) {
  sounds["background"].stop();
  sounds["thrust"].stop();
  sounds["missile"].stop();
  sounds["explosion"].stop();
  stateWorker.terminate();
}

function stateWorkerListener(event) {
  switch (event.data.type) {
    case "tick":
      state = event.data;
      break;
    case "sound":
      if (event.data.sound === "thrustStart") {
        thrustSound = playSound(sounds["thrust"]);
      } else if (event.data.sound === "thrustStop") {
        thrustSound.stop();
      } else {
        playSound(sounds[event.data.sound]);
      }
      break;
    case "init":
      state.sprites = event.data.sprites;
      resizeListener(BASE_WIDTH, BASE_HEIGHT, null);
      window.requestAnimationFrame(animationLoop);
      break;
  }
}

stateWorker.addEventListener("message", stateWorkerListener);
// window.addEventListener("DOMContentLoaded", setup);
window.addEventListener("unload", cleanup);
window.addEventListener("resize", (event) => resizeListener(BASE_WIDTH, BASE_HEIGHT, event));
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

