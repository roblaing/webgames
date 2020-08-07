/**
 * This is a translation of a Racket package, partly done to learn JavaScript's module conventions.
 * @module image
 * @see [HTDP image package]{@link https://docs.racket-lang.org/teachpack/2htdpimage.html}
 */

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


/**
 * (circle radius mode color) → image? or (circle radius outline-mode pen-or-color) → image?
 * @see [MDN arc]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc}
 * @function circle
 * @returns {Shape}
 * @param {Number} radius - not negative.
 * @param {("solid"|"outline"|0..255)} mode - solid=255, outline=0, inbetween transparency
 * @param {Pen|Color} penOrColor - a Pen or Color type
 */
function circle(radius, mode, penOrColor) {
  ctx.beginPath();
  ctx.arc(240, 160, 20, 0, Math.PI*2, false);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
  // return "image";
}

// above

// beside

// overlayAlign



export { circle
       };
