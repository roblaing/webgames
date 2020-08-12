"use strict";

const roles = [];
const legals = [];

/**
 * Assume inputs are always arrays (may need to complicate later for atomic elements)
 * @function
 * @param {Array} template - eg ["cell", "?x", "?y", "b"]
 * @param {Array} element - eg ["cell", 1, 1, "x"]
 * @returns {Boolean}
 */
function matchRule(template, element) {
  let idx;
  for (idx = 0; idx < template.length; idx++) {
    if (template[idx] !== element[idx]) {
      if (!(typeof template[idx] === "string" && template[idx].charAt(0) === "?")) {
        return false;
      }
    }
  }
  return true;
}

function getVariables(state, template) {
  return state.filter(element => matchRule(template, element));
}


function listener(event) {
  let idx;
  const action = Object.keys(event.data)[0];
  switch (action) {
    case "start":
      for (idx = 0; idx < event.data.start.role.length; idx++) {
        roles[idx] = event.data.start.role[idx];
      }
      for (idx = 0; idx < event.data.start.legal.length; idx++) {
        legals[idx] = event.data.start.legal[idx];
      }
      getLegals(event.data.start.init);
      break;
  }
}

addEventListener("message", listener);

fetch("tictactoe3.json")
.then((response) => response.json())
.then((start) => postMessage({"start": start}));

