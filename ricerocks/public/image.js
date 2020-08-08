/**
 * @file Module holding audio and image data and functions
 * @module image
 */

/**
 * A dictionary of images whose keys are the same as Sprite types
 * @constant {Object} images
 */
const images = { "background": new Image()
               , "debris": new Image()
               , "spaceship": new Image()
               , "asteroid": new Image()
               , "explosion": new Image()
               , "missile": new Image()
               };

images["background"].src = "./images/nebula_blue.f2014.png";
images["debris"].src = "./images/debris2_blue.png";
images["spaceship"].src = "./images/double_ship.png";
images["asteroid"].src = "./images/asteroid_blue.png";
images["missile"].src = "./images/shot2.png";
images["explosion"].src = "./images/explosion_alpha.png";

/**
 * [Canvas API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API}
 * @constant {HTMLCanvasElement} canvas
*/
window.canvas = document.querySelector("#board");
window.canvas.width = 800;
window.canvas.height = 600;

/**
 * [Canvas's context]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D}
 * @constant {CanvasRenderingContext2D} ctx
 */
const ctx = window.canvas.getContext("2d");

/**
 * Uses five of CanvasRenderingContext2D's many methods
 * @function draw
 * @param {Sprite} sprite The 9 parameters needed by ctx.drawImage, the 2 for ctx.translate, and angle for ctx.rotate
 * @returns {undefined} Causes side-effect of drawing image
 */
function draw(sprite) {
  // guard for when image not loaded yet
  if (images[sprite.type] === undefined || !images[sprite.type].complete) {
    return;
  }
  ctx.save();
  ctx.translate(sprite.xCentre, sprite.yCentre);
  ctx.rotate(sprite.angle);
  ctx.drawImage(images[sprite.type], sprite.column * sprite.width, sprite.row * sprite.height,
      sprite.width, sprite.height,
      -(window.state.scale * sprite.width)/2, -(window.state.scale * sprite.height)/2,
      window.state.scale * sprite.width, window.state.scale * sprite.height);
  ctx.restore();
}

function clearScene() {
  ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
}

function paintScene(imageName) {
  const image = images[imageName];
  if (image === undefined || !image.complete) {
    return;
  }
  ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, window.canvas.width, window.canvas.height);
}

function scaleText() {
  ctx.fillStyle = "white";
  ctx.font = window.state.scale * 22 + "px monospace";
}

function writeText() {
  ctx.fillText(`Lives ${window.state.lives}`, window.state.scale * 50, window.state.scale * 50);
  ctx.fillText(`Score ${window.state.score}`, window.state.scale * 680, window.state.scale * 50);
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
function getScale(baseWidth, baseHeight) {
  if (window.innerHeight > window.innerWidth) { // portrait
    return window.innerWidth/baseWidth;         // maximise width
  }
  return window.innerHeight/baseHeight;         // maximise height
}

/**
 * The resizeListener event handler
 * @function resizeListener
 * @returns {undefined} Mutates the scale attribute of
 * @param {Object} state -- changes scale and updates sprites and missiles positions
 * @param {pixels} windowWidth -- originally hardwired to window.innerWidth
 * @param {pixels} windowHeight -- originally hardwired to window.innerHeight
 * @param {pixels} baseWidth -- originally hardwired to backgroundImage.width
 * @param {pixels} baseHeight -- originally hardwired to backgroundImage.height
 */
function resizeListener(baseWidth, baseHeight, event) {
  const oldScale = window.state.scale;
  window.state.scale = getScale(baseWidth, baseHeight);
  window.canvas.width = window.state.scale * baseWidth;
  window.canvas.height = window.state.scale * baseHeight;
  window.state.width = window.canvas.width;
  window.state.height = window.canvas.height;
  scaleText(window.state.scale);
  window.state.sprites.forEach(function (sprite) {
    sprite.xCentre *= window.state.scale/oldScale;
    sprite.yCentre *= window.state.scale/oldScale;
    sprite.xDelta  *= window.state.scale/oldScale;
    sprite.yDelta  *= window.state.scale/oldScale;
  });
  window.state.missiles.forEach(function (sprite) {
    sprite.xCentre *= window.state.scale/oldScale;
    sprite.yCentre *= window.state.scale/oldScale;
    sprite.xDelta  *= window.state.scale/oldScale;
    sprite.yDelta  *= window.state.scale/oldScale;
  });
}

function drawState() {
  paintScene("background");
  window.state.sprites.forEach((sprite) => draw(sprite));
  window.state.missiles.forEach((missile) => draw(missile));
  writeText();
  paintScene("debris");
}

export { resizeListener, clearScene, drawState };

