/**
 * @file Module that updates state according to clock ticks and user input
 */

/**
 * The animation loop and event handlers communicate via this global object
 * @global
 * @constant {Object} state
 * @property {Sprite[]} sprites - spaceship and 12 asteroids in list
 */
const state = { "sprites": []
              , "missiles": []
              , "lives": 3
              , "score": 0
              , "scale": 1.0
              , "noise": null
              };

/**
 * Local object used by handlers to message the loop
 * @constant {Object} inputStates
 * @property {Boolean} inputStates.isUp - Up arrow pressed or not
 * @property {Boolean} inputStates.isThrust - Don't want to add more rocket noise 60 times a second
 * @property {Boolean} inputStates.isLeft - Left arrow pressed or not
 * @property {Boolean} inputStates.isRight - Right arrow pressed or not
 * @property {Boolean} inputStates.isSpace - Space arrow pressed or not
 * @property {Boolean} inputStates.isLoaded - Space bar needs to be released between missiles
 */
const inputStates = { isUp: false
                    , isThrust: false
                    , isLeft: false
                    , isRight: false
                    , isSpace: false
                    , isLoaded: true
                    };

const button2key = { "pointerdown": "keydown"
                   , "pointerup": "keyup"
                   , "leftButton": "ArrowLeft"
                   , "rightButton": "ArrowRight"
                   , "upButton": "ArrowUp"
                   , "spaceBar": "Spacebar"
                   };

const command = { "keydown": { get ArrowLeft() {return turnLeft(true)}
                             , get ArrowRight() {return turnRight(true)}
                             , get ArrowUp() {return burnRocket(true)}
                             , get Spacebar() {return fireMissile(true)}
                             }
                , "keyup":   { get ArrowLeft() {return turnLeft(false)}
                             , get ArrowRight() {return turnRight(false)}
                             , get ArrowUp() {return burnRocket(false)}
                             , get Spacebar() {return fireMissile(false)}
                             }
                };

// Sprite movement constants
const THRUST_SPEED = 0.1;
const RECOIL = -0.05;
const ROTATE_RATE = 60;
const MISSILE_SPEED = 4;

function collisions(sprite1, type) {
  if (type === "missile") {
    return state.missiles.filter((sprite2) => sprite2.type === type &&
      Math.hypot(sprite1.xCentre - sprite2.xCentre, sprite1.yCentre - sprite2.yCentre) <
        (state.scale * (sprite1.radius + sprite2.radius)));
  }
  return state.sprites.filter((sprite2) => sprite2.type === type &&
    Math.hypot(sprite1.xCentre - sprite2.xCentre, sprite1.yCentre - sprite2.yCentre) <
      (state.scale * (sprite1.radius + sprite2.radius)));
}

// Duplicated from game1.js, check if can be obtained by self.random_distance
function random_distance(sprite, r2, ratio) {
  const x1 = sprite.xCentre + sprite.xDelta;
  const y1 = sprite.yCentre + sprite.yDelta;
  const r1 = sprite.radius;
  const minDistance = ratio * state.scale * (r1 + r2);
  let x2;
  let y2;
  let d;
  do {
    x2 = Math.random() * (canvas.width + 1);
    y2 = Math.random() * (canvas.height + 1);
    d = Math.hypot(x2 - x1, y2 - y1);
  } while (d < minDistance);
  return [x2, y2];
}

/**
 * Prototype of each "thing" on the canvas
 * @namespace {Object} Sprite
 * @property {"spaceship"|"asteroid"|"missile"|"explosion"} type -- key shared with images and sounds dictionaries
 */

/**
 * Initialises a spaceship Sprite
 * @function
 * @returns {Sprite} A spaceship starting in the centre, facing up, stationary
 */
function createSpaceship() {
  return { type: "spaceship"
         , width: 90
         , height: 90
         , row: 0
         , column: 0
         , xCentre: canvas.width/2
         , yCentre: canvas.height/2
         , xDelta: 0
         , yDelta: 0
         , radius: 35
         , angle: -Math.PI/2
         , angleDelta: 0
         , tick: 0
         , lifespan: Infinity
         };
}

/**
 * Initialises an asteroid Sprite
 * @function
 * @returns {Sprite} Selects random start (not on top of spaceship), speed and rotation
 */
function createAsteroid() {
  let [x, y] = random_distance(state.sprites[0], 40, 1.5);
  const velocity = state.scale * (Math.random() - 0.5);
  const direction = Math.random() * 2 * Math.PI;
  return { type: "asteroid"
         , width: 90
         , height: 90
         , row: 0
         , column: 0
         , xCentre: x
         , yCentre: y
         , xDelta: velocity * Math.cos(direction)
         , yDelta: velocity * Math.sin(direction)
         , radius: 40
         , angle: Math.random() * 2 * Math.PI
         , angleDelta: (Math.random() - 0.5) * Math.PI/ROTATE_RATE
         , tick: 0
         , lifespan: Infinity
         };
}

/**
 * Initialises a missile Sprite, shoots from tip of spaceship
 * @function
 * @returns {Sprite} Missile shot from spaceship, lives 2 seconds (120 ticks)
 */
function createMissile() {
  let spaceship = state.sprites[0];
  return { type: "missile"
         , width: 10
         , height: 10
         , row: 0
         , column: 0
         , xCentre: spaceship.xCentre + (state.scale * spaceship.height/2 * Math.cos(spaceship.angle))
         , yCentre: spaceship.yCentre + (state.scale * spaceship.height/2 * Math.sin(spaceship.angle))
         , xDelta: spaceship.xDelta + (state.scale * MISSILE_SPEED * Math.cos(spaceship.angle))
         , yDelta: spaceship.yDelta + (state.scale * MISSILE_SPEED * Math.sin(spaceship.angle))
         , radius: 3
         , angle: spaceship.angle
         , angleDelta: 0
         , tick: 0
         , lifespan: 120
         };
}

function explode(sprite, lifespan) {
  sprite.was = sprite.type;
  sprite.type = "explosion";
  sprite.width = 128;
  sprite.height = 128;
  sprite.row = 0;
  sprite.column = 0;
  sprite.tick = 0;
  sprite.lifespan = lifespan;
}

function unexplode(sprite) {
  switch (sprite.was) {
    case "spaceship":
      sprite.type = "spaceship";
      sprite.width = 90;
      sprite.height = 90;
      sprite.row = 0;
      sprite.column = 0;
      sprite.tick = 0;
      sprite.lifespan = Infinity;
      return;
    case "asteroid":
      Object.assign(sprite, createAsteroid());
      return;
  }
}

/**
 * The physics/game engine
 * @function nextTick
 * @param {Sprite} sprite Position and movement parameters to be updated
 * @returns {undefined} Mutates the sprite object
 */
function nextTick(sprite) { // best to bring whole object
  let hitlist = [];
  sprite.xCentre += sprite.xDelta;
  sprite.yCentre += sprite.yDelta;
  sprite.angle += sprite.angleDelta;
  // space is toroidal
  if (sprite.xCentre < 0) {
    sprite.xCentre = canvas.width;
  }
  if (sprite.xCentre > canvas.width) {
    sprite.xCentre = 0;
  }
  if (sprite.yCentre < 0) {
    sprite.yCentre = canvas.height;
  }
  if (sprite.yCentre > canvas.height) {
    sprite.yCentre = 0;
  }
  // specific to type updates
  switch (sprite.type) {
    case "spaceship":
      if (inputStates.isLeft) {
        sprite.angleDelta = -Math.PI/ROTATE_RATE;
      }
      if (inputStates.isRight) {
        sprite.angleDelta = Math.PI/ROTATE_RATE;
      }
      if (!inputStates.isRight && !inputStates.isLeft) {
        sprite.angleDelta = 0;
      }
      if (inputStates.isUp) {
        sprite.column = 1;
        sprite.xDelta = sprite.xDelta + (state.scale * THRUST_SPEED * Math.cos(sprite.angle));
        sprite.yDelta = sprite.yDelta + (state.scale * THRUST_SPEED * Math.sin(sprite.angle));
      } else {
        sprite.column = 0;
      }
      hitlist = collisions(sprite, "asteroid");
      if (hitlist.length > 0) {
        if (inputStates.isThrust === true) {
          state.noise = "thrustStop";
          inputStates.isThrust = false;
        }
        state.noise = "explosion";
        state.lives--;
        explode(sprite, 30);
        hitlist.forEach((sprite2) => explode(sprite2, 120));
      }
      return;
    case "asteroid":
      hitlist = collisions(sprite, "missile");
      if (hitlist.length > 0) {
        state.noise = "explosion";
        state.score++;
        hitlist[0].tick = hitlist[0].lifespan; // only the first missile kills and gets killed
        explode(sprite, 60);
      }
      return;
    case "explosion":
      sprite.column = Math.floor((sprite.tick/sprite.lifespan) * 24);
      if ((sprite.lifespan - 1) === sprite.tick) {
        unexplode(sprite, state.sprites[0], canvas.width, canvas.height, state.scale);
      }
      sprite.tick++;
      return;
    case "missile":
      sprite.tick++;
      return;
  }
}


function turnLeft(bool) {
  inputStates.isLeft = bool;
}

function turnRight(bool) {
  inputStates.isRight = bool;
}

function burnRocket(bool) {
  inputStates.isUp = bool;
  if (inputStates.isUp && !inputStates.isThrust) {
    state.noise = "thrustStart";
    inputStates.isThrust = true;
  }
  if (!inputStates.isUp && inputStates.isThrust) {
    state.noise = "thrustStop";
    inputStates.isThrust = false;
  }
}

function fireMissile(bool) {
  inputStates.isSpace = bool;
  if (inputStates.isSpace && inputStates.isLoaded) {
    state.missiles.push(createMissile());
    state.sprites[0].xDelta = state.sprites[0].xDelta
      + (state.scale * RECOIL * Math.cos(state.sprites[0].angle));
    state.sprites[0].yDelta = state.sprites[0].yDelta
      + (state.scale * RECOIL * Math.sin(state.sprites[0].angle));
    state.noise = "missile";
    inputStates.isLoaded = false;
  }
  if (!inputStates.isSpace) {
    inputStates.isLoaded = true;
  }
}

/**
 * The user input event handler
 * @function uiListener
 * @param {KeyboardEvent|PointerEvent} event - Object sent by target.addEventListener(type, (event) => uiListener(inputStates, event));
 * @returns {undefined} Mutates the inputStates global object
 * @property {DOMString} event.type - Inherited from [Event]{@link https://developer.mozilla.org/en-US/docs/Web/API/Event#Properties}
 * @property {DOMString} event.key - A [Key Value]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values}
 * @property {DOMString} event.target - document since that's what called this function
 */
function uiListener(event) {
  if (["keydown", "keyup"].includes(event.type)) {
    if (event.key === " ") {
      command[event.type]["Spacebar"];
    }
    command[event.type][event.key];
    return;
  }
  if (["pointerdown", "pointerup"].includes(event.type)) {
    command[button2key[event.type]][button2key[event.target.id]];
    return;
  }
  if (event.key === "F12") { // allow debug screen
    event.target.dispatchEvent(event);
    return;
  }
  if (!Object.values(button2key).includes(key)) {  // pressing "non-game" key froze game
    event.preventDefault();
    return;
  }
}

function initState() {
  state.sprites[0] = createSpaceship();
  for (let idx = 1; idx <= 13; idx++) {
    state.sprites[idx] = createAsteroid();
  }
}

function updateState() {
  state.sprites.forEach((sprite) => nextTick(sprite));
  state.missiles.forEach((missile) => nextTick(missile));
  state.missiles = state.missiles.filter((missile) => missile.tick < missile.lifespan);
}

// export { initState, updateState, uiListener };

