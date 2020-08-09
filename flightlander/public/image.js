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

const lineStyle = { "solid": 0.0
                  , "dot": 0.0
                  , "long-dash": 0.0
                  , "short-dash": 0.0 
                  , "dot-dash": 0.0
                  }

async function getImageSize(image) {
  if (image.complete) {
    return {"width": image.width, "height": image.height};
  } else {
    await image.addEventListener("load", function() {
      return {"width": image.width, "height": image.height};
    });
  } 
}

/**
 * (above i1 i2 is ...) → image? Constructs an image by placing all of the argument images in a vertical row, 
 * aligned along their centers.
 */ 
function above(...images) {
  let sizes = [];
  for (let idx = 0; idx < images.length; idx++) {
    getImageSize(images[idx]).then((size) => {sizes[idx] = size}); 
  }
  return sizes;
}

/**
 * (place-image image x y scene) → image?
 * @function placeImage
 */ 

function placeImage(image, centreX, centreY, scene) {
  const x = image.width/2 - centreX;
  const y = image.height/2 - centreY;
  if (image.complete) {
    ctx.drawImage(image, centreX, centreY);
  } else {
    image.addEventListener("load", function() {
      ctx.drawImage(image, centreX, centreY);
    });
  }
}

// auxiliaries for createShape functions

function fillShape(color) {
  shadowCtx.fillStyle = color;
  shadowCtx.fill();
  shadowCtx.closePath();
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

/**
 * (circle radius mode color) → image? or (circle radius outline-mode pen-or-color) → image?
 * @see [MDN arc]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc}
 * @function createCircle
 * @returns {Shape}
 * @param {Number} radius - not negative.
 * @param {("solid"|"outline"|0..255)} mode - solid=255, outline=0, inbetween transparency
 * @param {Pen|Color} penOrColor - a Pen or Color type
 * ctx.lineCap = "butt" || "round" || "square";
 * ctx.lineJoin = "bevel" || "round" || "miter";
 * @returns {Image}
 */
function createCircle(radius, mode, penOrColor) {
  const image = new Image();
  let width = 2 * radius;
  let height = width;
  if (penOrColor.hasOwnProperty("width")) {
    width += penOrColor.width;
    height += penOrColor.width;
  } else {
    width += 1;
    height += 1;
  } 
  shadowCanvas.width = width;
  shadowCanvas.height = height;
  shadowCtx.clearRect(0, 0, width, height);
  shadowCtx.beginPath();
  shadowCtx.arc(width/2, height/2, radius, 0, 2*Math.PI);
  switch (mode) {
    case "solid": fillShape(penOrColor);
    case "outline": strokeShape(penOrColor);
  }
  image.src = shadowCanvas.toDataURL();
  return image;
}

/**
 * (rectangle width height mode color) → image?
 * @see [MDN arc]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect}
 */
function createRectangle(width, height, mode, penOrColor) {
  const image = new Image();
  if (penOrColor.hasOwnProperty("width")) {
    width += penOrColor.width;
    height += penOrColor.width;
  } else {
    width += 1;
    height += 1;
  } 
  shadowCanvas.width = width;
  shadowCanvas.height = height;
  shadowCtx.clearRect(0, 0, width, height);
  shadowCtx.beginPath();
  shadowCtx.rect(0, 0, width, height);   // only difference
  switch (mode) {
    case "solid": fillShape(penOrColor);
    case "outline": strokeShape(penOrColor);
  }
  image.src = shadowCanvas.toDataURL();
  return image;
}

/**
 * (triangle side-length mode color) → image? Constructs a upward-pointing equilateral triangle.
 * @see [MDN arc]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect}
 */
function createTriangle(side, mode, penOrColor) {
  const image = new Image();
  let width = side;
  let height = side * Math.sin(Math.PI/3);
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
  shadowCtx.moveTo(padding/2, height - (padding/2));
  shadowCtx.lineTo(width/2, (padding/2));
  shadowCtx.lineTo(width - (padding/2), height - (padding/2));
  shadowCtx.lineTo(padding/2, height - (padding/2));
  switch (mode) {
    case "solid": fillShape(penOrColor);
    case "outline": strokeShape(penOrColor);
  }
  image.src = shadowCanvas.toDataURL();
  return image;
}

const redSolidCircle = createCircle(20, "solid", "red");
const circleOutline = createCircle(20, "outline", { "color": "black" 
                                                  , "width": 2
                                                  , "style": "solid"
                                                  , "cap": "butt"
                                                  , "join": "miter"
                                                  });

const blackBox = createRectangle(40, 30, "solid", "black");
const redTriangle = createTriangle(40, "solid", "red");

// placeImage(redTriangle, canvas.width/2, canvas.height/2, null);
// placeImage(blackBox, canvas.width/2, canvas.height/2, null);

// placeImage(redSolidCircle, canvas.width/2, canvas.height/2, null);
// placeImage(circleOutline, canvas.width/2, canvas.height/2, null);

console.log(above(blackBox, redTriangle));

/**
 * (struct color (red green blue alpha)...
 * @typedef {(String|Object)}} Color
 * @property {0..255} red - byte
 * @property {0..255} green - byte
 * @property {0..255} blue - byte
 * @property {0..255} alpha - transparency
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

/*
// red square
ctx.beginPath();
ctx.rect(20, 40, 50, 50);
ctx.fillStyle = "#FF0000";
ctx.fill();
ctx.closePath();


ctx.beginPath();
ctx.rect(160, 10, 100, 40);
ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
ctx.stroke();
ctx.closePath();
*/

// above

// beside

// overlayAlign


/*
export { circle
       };
*/
