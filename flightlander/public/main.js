"use strict";

/*	
underlay(circle(6, "solid", "yellow"), square(4, "solid", "orange"))
.then(image => ctx.drawImage(image, 0, 0));
*/

circle(20, "solid", "red")
.then(image => ctx.drawImage(image, 0, 0));

/*
above( beside(triangle(40, "solid", "red"), triangle(30, "solid", "red"))
     , rectangle(70, 30, "solid", "black")).then(image => ctx.drawImage(image, 0, 0));
*/

/*
const redSolidCircle = circle(20, "solid", "red");
const circleOutline = circle(20, "outline", { "color": "black" 
                                                  , "width": 2
                                                  , "style": "solid"
                                                  , "cap": "butt"
                                                  , "join": "miter"
                                                  });

const blackBox = rectangle(40, 30, "solid", "black");
const redTriangle = triangle(40, "solid", "red");

placeImage(triangle, canvas.width/2, canvas.height/2, null);
*/
// placeImage(blackBox, canvas.width/2, canvas.height/2, null);

// placeImage(redSolidCircle, canvas.width/2, canvas.height/2, null);
// placeImage(circleOutline, canvas.width/2, canvas.height/2, null);

// console.log(above(blackBox, redTriangle));

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
