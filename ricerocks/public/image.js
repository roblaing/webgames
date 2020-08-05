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

images["background"].src = "nebula_blue.f2014.png";
images["debris"].src = "debris2_blue.png";
images["spaceship"].src = "double_ship.png";
images["asteroid"].src = "asteroid_blue.png";
images["missile"].src = "shot2.png";
images["explosion"].src = "explosion_alpha.png";

/**
 * [Canvas API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API}
 * @constant {HTMLCanvasElement} canvas
*/
const canvas = document.querySelector("#board");

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
function draw(sprite, scale) {
  ctx.save();
  ctx.translate(sprite.xCentre, sprite.yCentre);
  ctx.rotate(sprite.angle);
  try {
    ctx.drawImage(images[sprite.type], sprite.column * sprite.width, sprite.row * sprite.height,
      sprite.width, sprite.height,
      -(scale * sprite.width)/2, -(scale * sprite.height)/2,
      scale * sprite.width, scale * sprite.height);
  } catch {
    console.log("ctx.drawImage called before image loaded");
  }
  ctx.restore();
}

function clearScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function paintScene(image) {
  try {
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
  } catch {
    console.log("ctx.drawImage called before image loaded");
  }
}

function scaleText(scale) {
  ctx.fillStyle = "white";
  ctx.font = scale * 22 + "px monospace";
}

function writeText(state) {
  ctx.fillText("Lives", state.scale * 50, state.scale * 50);
  ctx.fillText("Score", state.scale * 680, state.scale * 50);
  ctx.fillText(state.lives, state.scale * 50, state.scale * 80);
  ctx.fillText(state.score, state.scale * 680, state.scale * 80);
}

export { canvas, images, draw, clearScene, paintScene, scaleText, writeText };

