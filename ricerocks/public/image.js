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
        -(state.scale * sprite.width)/2, -(state.scale * sprite.height)/2,
        state.scale * sprite.width, state.scale * sprite.height);
      ctx.restore();
    });
  }
}

function clearScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function paintScene(imageName) {
  if (images[imageName] !== undefined) {
    images[imageName].then(image => {
      ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
      writeText();
    });
  }
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

function scaleText() {
  ctx.fillStyle = "white";
  ctx.font = `${state.scale * 22}px monospace`;
}

function writeText() {
  ctx.fillText(`Lives ${state.lives}`, state.scale * 50, state.scale * 50);
  ctx.fillText(`Score ${state.score}`, state.scale * 680, state.scale * 50);
}

function drawState() {
  paintScene("background");
  state.sprites.forEach((sprite) => draw(sprite));
  state.missiles.forEach((missile) => draw(missile));
  paintScene("debris");
}

/**
 * The resizeListener event handler
 * @function resizeListener
 * @returns {undefined} Mutates the scale attribute of
 */
function resizeListener(event) {
  const oldScale = state.scale;
  state.scale = getScale(BASE_WIDTH, BASE_HEIGHT);
  canvas.width = state.scale * BASE_WIDTH;
  canvas.height = state.scale * BASE_HEIGHT;
  state.width = canvas.width;
  state.height = canvas.height;
  scaleText(state.scale);
  state.sprites.forEach(function (sprite) {
    sprite.xCentre *= state.scale/oldScale;
    sprite.yCentre *= state.scale/oldScale;
    sprite.xDelta  *= state.scale/oldScale;
    sprite.yDelta  *= state.scale/oldScale;
  });
  state.missiles.forEach(function (sprite) {
    sprite.xCentre *= state.scale/oldScale;
    sprite.yCentre *= state.scale/oldScale;
    sprite.xDelta  *= state.scale/oldScale;
    sprite.yDelta  *= state.scale/oldScale;
  });
}


// export { resizeListener, clearScene, drawState };

