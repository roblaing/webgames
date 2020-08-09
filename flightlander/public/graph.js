/**
 * A learning exercise is computer graphic trigonometry
 * @file graph
 */

window.canvas = document.querySelector("#board");
const ctx = window.canvas.getContext("2d");

const shadowCanvas = document.createElement("canvas");
const shadowCtx = shadowCanvas.getContext("2d");

/**
 * graph f(x) between minX and maxX
 * @function graphF
 * @param {function} f - eg Math.sin
 * @param {Number} minX - left hand starting number
 * @param {Number} maxX - right hand ending number
 * @param {color} color - CSS color 
 */


function colorCircle(x0, y0, radius) {
  let x1;
  let y1;
  let radian;
  ctx.translate(x0, y0);
  for (let degree = 0; degree < 360; degree += 0.1) {
    radian = degree * (Math.PI/180);
    x1 = radius * Math.cos(radian);
    y1 = radius * Math.sin(radian);
    ctx.beginPath(); // needed here to clear strokeStyle each iteration
    ctx.strokeStyle = `hsl(${degree}, 100%, 50%)`;
    ctx.moveTo(0, 0);
    // ctx.lineWidth = 1;
    ctx.lineTo(x1, -y1);
    ctx.stroke();
    // ctx.closePath();
  }
}

// colorCircle(window.canvas.width/2, window.canvas.height/2, window.canvas.height/2);


