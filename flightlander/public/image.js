/**
 * @file This is a translation of a Racket package, partly done to learn JavaScript's module conventions.
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
  return "image";
}

// above

// beside

// overlayAlign



export { circle
       };
