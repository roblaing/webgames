/**
 * Global object used by handlers to message the loop
 * @constant {Object} inputStates
 * @namespace inputStates
 * @property {Boolean} inputStates.isUp - Up arrow pressed or not
 * @property {Boolean} inputStates.isThrust - Don't want to add more rocket noise 60 times a second
 * @property {Boolean} inputStates.isLeft - Left arrow pressed or not
 * @property {Boolean} inputStates.isRight - Right arrow pressed or not
 * @property {Boolean} inputStates.isSpace - Space arrow pressed or not
 * @property {Boolean} inputStates.isLoaded - Space bar needs to be released between missiles
 * @property {AudioBufferSourceNode} inputStates.soundBuffer - Stored to stop rocket noise
 */
const inputStates = { isUp: false
                    , isThrust: false
                    , isLeft: false
                    , isRight: false
                    , isSpace: false
                    , isLoaded: true
                    };

// Sprite movement constants
const THRUST_SPEED = 0.1;
const RECOIL = -0.05;
const ROTATE_RATE = 60;
const MISSILE_SPEED = 4;
let state = {"sprites": [], "width": 800, "height": 600, "scale": 1.0};

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
    x2 = Math.random() * (state.width + 1);
    y2 = Math.random() * (state.height + 1);
    d = Math.hypot(x2 - x1, y2 - y1);
  } while (d < minDistance);
  return [x2, y2];
}

/**
 * Initialises a spaceship Sprite
 * @function
 * @param {HTMLImageElement} spaceshipImage - A global constant, but passed as a parameter to enable mocking in Jasemine
 * @param {HTMLCanvasElement} canvas - A global constant, but passed as a parameter to enable mocking in Jasemine
 * @returns {Sprite} A spaceship starting in the centre, facing up, stationary
 */
function createSpaceship() {
  return { type: "spaceship"
         , width: 90
         , height: 90
         , row: 0
         , column: 0
         , xCentre: state.width/2
         , yCentre: state.height/2
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
 * @param {Sprite} spaceship - needs direction, position and velocity of spaceship
 * @returns {Sprite} Missile shot from spaceship, lives 2 seconds (120 ticks)
 */
function createMissile(spaceship) {
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
    sprite.xCentre = state.width;
  }
  if (sprite.xCentre > state.width) {
    sprite.xCentre = 0;
  }
  if (sprite.yCentre < 0) {
    sprite.yCentre = state.height;
  }
  if (sprite.yCentre > state.height) {
    sprite.yCentre = 0;
  }
  // specific to type updates
  switch (sprite.type) {
    case "spaceship":
      if (inputStates.isUp) {
        sprite.column = 1;
        sprite.xDelta = sprite.xDelta + (state.scale * THRUST_SPEED * Math.cos(sprite.angle));
        sprite.yDelta = sprite.yDelta + (state.scale * THRUST_SPEED * Math.sin(sprite.angle));
      } else {
        sprite.column = 0;
      }
      if (inputStates.isRight) {
        sprite.angleDelta = Math.PI/ROTATE_RATE;
      }
      if (inputStates.isLeft) {
        sprite.angleDelta = -Math.PI/ROTATE_RATE;
      }
      if (!inputStates.isRight && !inputStates.isLeft) {
        sprite.angleDelta = 0;
      }
      hitlist = collisions(sprite, "asteroid");
      if (hitlist.length > 0) {
        if (inputStates.isThrust === true) {
          postMessage({"type": "sound", "sound": "thrustStop"});
          inputStates.isThrust = false;
        }
        postMessage({"type": "sound", "sound": "explosion"});
        state.lives--;
        explode(sprite, 30);
        hitlist.forEach((sprite2) => explode(sprite2, 120));
      }
      return;
    case "asteroid":
      hitlist = collisions(sprite, "missile");
      if (hitlist.length > 0) {
        postMessage({"type": "sound", "sound": "explosion"});
        state.score++;
        hitlist[0].tick = hitlist[0].lifespan; // only the first missile kills and gets killed
        explode(sprite, 60);
      }
      return;
    case "explosion":
      sprite.column = Math.floor((sprite.tick/sprite.lifespan) * 24);
      if ((sprite.lifespan - 1) === sprite.tick) {
        unexplode(sprite, state.sprites[0], state.width, state.height, state.scale);
      }
      sprite.tick++;
      return;
    case "missile":
      sprite.tick++;
      return;
  }
}

function updateInputs(inputs) {
  switch (inputs.key) {
    case "ArrowLeft":
      inputStates.isLeft = inputs.bool;
      return;
    case "ArrowRight":
      inputStates.isRight = inputs.bool;
      return;
    case "ArrowUp":
      inputStates.isUp = inputs.bool;
      if (inputStates.isUp && !inputStates.isThrust) {
        postMessage({"type": "sound", "sound": "thrustStart"});
        inputStates.isThrust = true;
      }
      if (!inputStates.isUp && inputStates.isThrust) {
        postMessage({"type": "sound", "sound": "thrustStop"});
        inputStates.isThrust = false;
      }
      return;
    case " ":
      inputStates.isSpace = inputs.bool;
      if (inputStates.isSpace && inputStates.isLoaded) {
        state.missiles.push(createMissile(state.sprites[0]));
        state.sprites[0].xDelta = state.sprites[0].xDelta + (state.scale * RECOIL * Math.cos(state.sprites[0].angle));
        state.sprites[0].yDelta = state.sprites[0].yDelta + (state.scale * RECOIL * Math.sin(state.sprites[0].angle));
        postMessage(state);
        postMessage({"type": "sound", "sound": "missile"});
        inputStates.isLoaded = false;
      }
      if (!inputStates.isSpace) {
        inputStates.isLoaded = true;
      }
      return;
  }
}

addEventListener("message", function(event) {
  switch (event.data.type) {
    case "tick": {
      state = event.data;
      state.sprites.forEach((sprite) => nextTick(sprite));
      state.missiles.forEach((missile) => nextTick(missile));
      state.missiles = state.missiles.filter((missile) => missile.tick < missile.lifespan);
      postMessage(state);
      break;
    }
    case "inputStates":
      updateInputs(event.data)
      break;
  }
});

state.sprites[0] = createSpaceship();
for (let idx = 1; idx <= 13; idx++) {
  state.sprites[idx] = createAsteroid();
}
this.postMessage({"type": "init", "sprites": state.sprites});


