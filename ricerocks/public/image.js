/**
 * @file Module holding audio and image data and functions
 */

const images = {};

/**
 * A dictionary of images whose keys are the same as Sprite types
 * @constant {Object} images
 */

/**
 * [Canvas API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API}
 * @constant {HTMLCanvasElement} canvas
*/
const canvas = document.querySelector("#board");
const BASE_WIDTH = canvas.width; // set in index.html
const BASE_HEIGHT = canvas.height;

/**
 * [Canvas's context]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D}
 * @constant {CanvasRenderingContext2D} ctx
 */
const ctx = canvas.getContext("2d");

/**
 * Uses five of CanvasRenderingContext2D's many methods
 * @function draw
 * @param {Sprite} sprite The 9 parameters needed by ctx.drawImage, the 2 for ctx.translate, and angle for ctx.rotate
 * @returns {undefined} Causes side-effect of drawing image
 */
function draw(sprite) {
  if (images[sprite.type] !== undefined) {
    images[sprite.type].then(image => {
      ctx.save();
      ctx.translate(sprite.xCentre, sprite.yCentre);
      ctx.rotate(sprite.angle);
      ctx.drawImage(image, sprite.column * sprite.width, sprite.row * sprite.height,
        sprite.width, sprite.height,
        -(window.state.scale * sprite.width)/2, -(window.state.scale * sprite.height)/2,
        window.state.scale * sprite.width, window.state.scale * sprite.height);
      ctx.restore();
    });
  }
}

function clearScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function paintScene(imageName) {
  if (images[imageName] !== undefined) {
    images[imageName].then(image =>
      ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height));
  }
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
 * @param {pixels} BASE_WIDTH -- originally hardwired to backgroundImage.width
 * @param {pixels} BASE_HEIGHT -- originally hardwired to backgroundImage.height
 */
function getScale(baseWidth, baseHeight) {
  if (window.innerHeight > window.innerWidth) { // portrait
    return window.innerWidth/baseWidth;         // maximise width
  }
  return window.innerHeight/baseWidth;         // maximise height
}

/**
 * The resizeListener event handler
 * @function resizeListener
 * @returns {undefined} Mutates the scale attribute of
 * @param {Object} state -- changes scale and updates sprites and missiles positions
 * @param {pixels} windowWidth -- originally hardwired to window.innerWidth
 * @param {pixels} windowHeight -- originally hardwired to window.innerHeight
 * @param {pixels} BASE_WIDTH -- originally hardwired to backgroundImage.width
 * @param {pixels} BASE_HEIGHT -- originally hardwired to backgroundImage.height
 */
function resizeListener(event) {
  const oldScale = window.state.scale;
  window.state.scale = getScale(BASE_WIDTH, BASE_HEIGHT);
  canvas.width = window.state.scale * BASE_WIDTH;
  canvas.height = window.state.scale * BASE_HEIGHT;
  window.state.width = canvas.width;
  window.state.height = canvas.height;
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

// export { resizeListener, clearScene, drawState };

