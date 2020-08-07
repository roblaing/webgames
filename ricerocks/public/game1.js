/**
 * @file A simple arcade game translated to JavaScript from a
 * [Python Mooc]{@link https://www.coursera.org/learn/interactive-python-1} given by Rice University.
 * @author Robert Laing
 * @requires rice-rocks.js
 */

// image.js attaches canvas to window to make it available across modules
import { resizeListener, clearScene, drawState } from "./image.js";
import { playSound } from "./sound.js";
import { initState, updateState, uiListener } from "./state-loop.js";

const BASE_WIDTH = 800;
const BASE_HEIGHT = 600;

/**
 * The thing that freezes Jasmine to make this untestable
 * @function animationLoop
 * @returns {undefined} Never returning infinite loop
 */
function animationLoop() {
  clearScene();
  drawState();
  playSound();
  updateState();
  window.requestAnimationFrame(animationLoop);
}

function setup(event) {
  initState();
  resizeListener(BASE_WIDTH, BASE_HEIGHT, null);
  window.requestAnimationFrame(animationLoop);
}

function cleanup(event) {
  playSound("thrustStop");
  playSound("backgroundStop");
}

window.addEventListener("DOMContentLoaded", setup);
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

