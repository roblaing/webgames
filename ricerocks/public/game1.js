"use strict";

const canvas = document.querySelector("#board");
const context = canvas.getContext("2d");

/*
function loop() {
  ...
  window.requestAnimationFrame(loop);
}
*/

function key_listener(Bool, event) {
  switch (event.key) {
    case "ArrowLeft":
      inputStates.left = Bool;
      break;
    case "ArrowUp":
      inputStates.up = Bool;
      break;
    case "ArrowRight":
      inputStates.right = Bool;
      break;
    case " ":
      inputStates.space = Bool;
      break;
    default:
      event.preventDefault();
  }
}

document.addEventListener('keydown', (event) => key_listener(true,  event));
document.addEventListener('keyup',   (event) => key_listener(false, event));
// window.requestAnimationFrame(loop);
