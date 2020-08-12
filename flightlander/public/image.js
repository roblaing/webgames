"use strict";

/**
 * This is a translation of a Racket package, partly done to learn JavaScript's module conventions.
 * @file image
 * @see [HTDP image package]{@link https://docs.racket-lang.org/teachpack/2htdpimage.html}
 */

window.canvas = document.querySelector("#board");
const ctx = window.canvas.getContext("2d");

const shadowCanvas = document.createElement("canvas");
const shadowCtx = shadowCanvas.getContext("2d");
shadowCtx.globalCompositeOperation = "copy";

/**
 * Can be a CSS permitted color: keyword, rgb, rgba or hsl
 * @typedef {String} Color
 */

/**
 * (struct pen (color width style cap join)...
 * @typedef {Object} Pen
 * @property {Color} color
 * @property {0..255} width
 * @property {("solid"|"dot"|"long-dash"|"short-dash"|"dot-dash")} style
 * @property {("round"|"projecting"|"butt")} cap
 * @property {("round"|"bevel"|"miter")} join
 */


const lineStyle = { "solid": 0.0
                  , "dot": 0.0
                  , "long-dash": 0.0
                  , "short-dash": 0.0 
                  , "dot-dash": 0.0
                  }

/**
 * (above i1 i2 is ...) → image? Constructs an image by placing all of the argument images in a vertical row, 
 * aligned along their centers.
 * @function above
 */ 
function above(...images) {
  let width;
  let height;
  let x;
  let y;
  let image = new Image();
  return Promise.all(images)
  .then(values => {
    width = Math.max(...values.map(img => img.width));
    height = values.map(img => img.height).reduce((a, b) => a + b, 0);
    shadowCanvas.width = width;
    shadowCanvas.height = height;
    shadowCtx.clearRect(0, 0, width, height);
    y = 0;
    for (let idx = 0; idx < values.length; idx++ ) {
      x = (width/2) - (values[idx].width/2);
      shadowCtx.drawImage(values[idx], x, y)
      y += values[idx].height;
    }
    image.src = shadowCanvas.toDataURL();
    return new Promise(function(resolve, reject) {
      image.addEventListener("load", (event) => resolve(image));
    });
  });
}

/**
 * (beside i1 i2 is ...) → image? Constructs an image by placing all of the argument images in a horizontal row, 
 * aligned along their centers.
 * @function beside
 */
function beside(...images) {
  let width;
  let height;
  let x;
  let y;
  let image = new Image();
  return Promise.all(images)
  .then(values => {
    width = values.map(img => img.width).reduce((a, b) => a + b, 0);
    height = Math.max(...values.map(img => img.height));
    shadowCanvas.width = width;
    shadowCanvas.height = height;
    shadowCtx.clearRect(0, 0, width, height);
    x = 0;
    for (let idx = 0; idx < values.length; idx++ ) {
      y = (height/2) - (values[idx].height/2);
      shadowCtx.drawImage(values[idx], x, y)
      x += values[idx].width;
    }
    image.src = shadowCanvas.toDataURL();
    return new Promise(function(resolve, reject) {
      image.addEventListener("load", (event) => resolve(image));
    });
  });
}

/**
 * (beside/align y-place i1 i2 is ...) → image?
 * Constructs an image by placing all of the argument images in a horizontal row, 
 * lined up as indicated by the y-place argument. 
 * @function besideAlign
 */

/**
 * (overlay i1 i2 is ...) → image? 
 * The first argument goes on top of the second argument, 
 * which goes on top of the third argument, etc. The images are all lined up on their centers.
 * @function overlay
 */
function overlay(...images) {
  let width;
  let height;
  let x;
  let y;
  let image = new Image();
  return Promise.all(images)
  .then(values => {
    width = Math.max(...values.map(img => img.width));
    height = Math.max(...values.map(img => img.height));
    shadowCanvas.width = width;
    shadowCanvas.height = height;
    shadowCtx.clearRect(0, 0, width, height);
    for (let idx = values.length - 1; idx >= 0; idx-- ) {
      x = (width/2) - (values[idx].width/2);
      y = (height/2) - (values[idx].height/2);
      shadowCtx.drawImage(values[idx], x, y)
    }
    image.src = shadowCanvas.toDataURL();
    return new Promise(function(resolve, reject) {
      image.addEventListener("load", (event) => resolve(image));
    });
  });
}

function underlay(...images) {
  let width;
  let height;
  let x;
  let y;
  let image = new Image();
  return Promise.all(images)
  .then(values => {
    width = Math.max(...values.map(img => img.width));
    height = Math.max(...values.map(img => img.height));
    shadowCanvas.width = width;
    shadowCanvas.height = height;
    shadowCtx.clearRect(0, 0, width, height);
    for (let idx = 0; idx < values.length; idx++ ) {
      x = (width/2) - (values[idx].width/2);
      y = (height/2) - (values[idx].height/2);
      shadowCtx.drawImage(values[idx], x, y)
    }
    image.src = shadowCanvas.toDataURL();
    return new Promise(function(resolve, reject) {
      image.addEventListener("load", (event) => resolve(image));
    });
  });
}


/**
 * (place-image image x y scene) → image?
 * @function placeImage
 */ 

function placeImage(promise, centreX, centreY, scene) {
  promise.then(image => {
    const x = centreX - image.width/2;
    const y = centreY - image.height/2;
    ctx.drawImage(image, x, y);
  });
}

// auxiliaries for createShape functions

function fillShape(color) {
  shadowCtx.fillStyle = color;
  shadowCtx.fill();
  shadowCtx.closePath();
}

/**
 * A gotcha here is htdp uses a 0..255 byte range whereas JavaScript a 0.0..1.0 range
 * @function transparencyFillShape
 */
function transparencyFillShape(color, alphaByte) {
  const oldAlpha = shadowCtx.globalAlpha;
  shadowCtx.globalAlpha = alphaByte/255;
  fillShape(color);
  shadowCtx.globalAlpha = oldAlpha;
}

function strokeShape(penOrColor) {
  if (typeof penOrColor === "string") {
    shadowCtx.strokeStyle = penOrColor;
  } else {
    shadowCtx.strokeStyle = penOrColor.color;
    shadowCtx.lineWidth = penOrColor.width;
    shadowCtx.lineDashOffset = penOrColor.style;
    shadowCtx.lineCap = lineStyle[penOrColor.cap];
    shadowCtx.lineJoin = penOrColor["join"];
  }
  shadowCtx.stroke();
}

function setupShape(width, height, penOrColor) {
  let padding;
  if (penOrColor.hasOwnProperty("width")) {
    padding = penOrColor.width;
  } else {
    padding = 1;
  }
  width += padding;
  height += padding;
  shadowCanvas.width = width;
  shadowCanvas.height = height;
  shadowCtx.clearRect(0, 0, width, height);
  shadowCtx.beginPath();
  return [width, height];
}

/**
 * (circle radius mode color) → image? or (circle radius outline-mode pen-or-color) → image?
 * @see [MDN arc]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc}
 * @function circle
 * @returns {Shape}
 * @param {Number} radius - not negative.
 * @param {("solid"|"outline"|0..255)} mode - solid=255, outline=0, inbetween transparency
 * @param {Pen|Color} penOrColor - a Pen or Color type
 * ctx.lineCap = "butt" || "round" || "square";
 * ctx.lineJoin = "bevel" || "round" || "miter";
 * @returns {promise}
 */
function circle(radius, mode, penOrColor) {
  const image = new Image();
  let width = 2 * radius;
  let height = width;
  [width, height] = setupShape(width, height, penOrColor)
  shadowCtx.arc(width/2, height/2, radius, 0, 2*Math.PI);
  switch (mode) {
    case "solid": fillShape(penOrColor);
    case "outline": strokeShape(penOrColor);
    default: // 0...255
      transparencyFillShape(penOrColor, mode);
  }
  image.src = shadowCanvas.toDataURL();
  return new Promise(function(resolve, reject) {
    image.addEventListener("load", (event) => resolve(image));
  });
}

/**
 * (ellipse width height mode color) → image?
 * @function ellipse
 */
function ellipse(width, height, mode, penOrColor) {
  const image = new Image();
  const x = width/2;
  const y = height/2;
  [width, height] = setupShape(width, height, penOrColor)
  shadowCtx.ellipse(x, y, x, y, 0, 0, 2*Math.PI);
  switch (mode) {
    case "solid": fillShape(penOrColor);
    case "outline": strokeShape(penOrColor);
    default: // 0...255
      transparencyFillShape(penOrColor, mode);
  }
  image.src = shadowCanvas.toDataURL();
  return new Promise(function(resolve, reject) {
    image.addEventListener("load", (event) => resolve(image));
  });
}

/**
 * Constructs an image representing a line segment that connects the points (0,0) to (x1,y1).
 * @function line
 * @param {pixel} x1 - end point from 0 (or start point to 0 if negative)
 * @param {pixel} y1 - end point from 0 (or start point to 0 if negative)
 * @returns {Promise}
 * @example
 * line(30, -30, "red") 
 */
function line(x1, y1, penOrColor) {
  const image = new Image();
  let width = x1;
  let height = y1;
  let x0 = 0;
  let y0 = 0;
  if (x1 < 0) {
    x0 = -x1;
    x1 = 0;
  }
  if (y1 < 0) {
    y0 = -y1;
    y1 = 0;
  }
  if (typeof penOrColor === "string") {
    penOrColor = {"color": penOrColor, "width": 1, "style": "solid", "cap": "butt", "join": "miter"};
  }
  [width, height] = setupShape(width, height, penOrColor)
  shadowCtx.moveTo(x0 + penOrColor.width, y0 + penOrColor.width);
  shadowCtx.lineTo(x1 - penOrColor.width, y1 - penOrColor.width);
  strokeShape(penOrColor);
  image.src = shadowCanvas.toDataURL();
  return new Promise(function(resolve, reject) {
    image.addEventListener("load", (event) => resolve(image));
  });
}

/**
 * (text string font-size color) → image?
 * Constructs an image that draws the given string, using the font size and color.
 * @function text
 */
function text(string, fontSize, color) {
  shadowCtx.font = `${fontSize}px serif`;
}

/**
 * (rectangle width height mode color) → image?
 * @see [MDN arc]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect}
 * @function rectangle
 */
function rectangle(width, height, mode, penOrColor) {
  const image = new Image();
  [width, height] = setupShape(width, height, penOrColor)
  shadowCtx.rect(0, 0, width, height);
  switch (mode) {
    case "solid": fillShape(penOrColor);
    case "outline": strokeShape(penOrColor);
    default: // 0...255
      transparencyFillShape(penOrColor, mode);
  }
  image.src = shadowCanvas.toDataURL();
  return new Promise(function(resolve, reject) {
    image.addEventListener("load", (event) => resolve(image));
  });
}

/**
 * (square side-len mode color) → image?
 */
function square(sideLength, mode, penOrColor) {
  return rectangle(sideLength, sideLength, mode, penOrColor);
}

/**
 * (triangle side-length mode color) → image? Constructs a upward-pointing equilateral triangle.
 * @see [MDN arc]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect}
 */
function triangle(side, mode, penOrColor) {
  const image = new Image();
  let padding;
  if (penOrColor.hasOwnProperty("width")) {
    padding = penOrColor.width;
  } else {
    padding = 1;
  }
  let width = side;
  let height = side * Math.sin(Math.PI/3);
  [width, height] = setupShape(width, height, penOrColor)
  shadowCtx.moveTo(padding/2, height - (padding/2));
  shadowCtx.lineTo(width/2, (padding/2));
  shadowCtx.lineTo(width - (padding/2), height - (padding/2));
  shadowCtx.lineTo(padding/2, height - (padding/2));
  switch (mode) {
    case "solid": fillShape(penOrColor);
    case "outline": strokeShape(penOrColor);
    default: // 0...255
      transparencyFillShape(penOrColor, mode);
  }
  image.src = shadowCanvas.toDataURL();
  return new Promise(function(resolve, reject) {
    image.addEventListener("load", (event) => resolve(image));
  });
}

