/**
 * @file A simple arcade game translated to JavaScript from a
 * [Python Mooc]{@link https://www.coursera.org/learn/interactive-python-1} given by Rice University.
 * @author Robert Laing
 * @requires rice-rocks.js
 */

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
  resizeListener(null);
  window.requestAnimationFrame(animationLoop);
}

function cleanup(event) {
  playSound("thrustStop");
  playSound("backgroundStop");
}

fetch("ricerocks.json")
.then(response => response.json())
.then(data => {
  Object.keys(data.images).forEach(img => {
    images[img] = new Promise((resolve, reject) => {
      let image = new Image();
      image.src = data.images[img];
      image.addEventListener("load", () => resolve(image));
    });
  });
  /* Needs be fixed with promises
  Object.keys(data.sounds).forEach(sound => {
    sounds[sound] = audioCtx.createBufferSource();
    loadSound(data.sounds[sound], sounds[sound]);
    // should be moved to promise
    sounds["background"].loop = true;
    sounds["background"].connect(audioCtx.destination);
    sounds["background"].start();
  });
  */
});

window.addEventListener("DOMContentLoaded", setup);
window.addEventListener("unload", cleanup);
window.addEventListener("resize", resizeListener);
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

