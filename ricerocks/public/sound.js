/**
 * @file Module simplifying JavaScript's audio to a public interface of an images dictionary and playSound function
 * @module sound
 */

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Dictionary of sound objects
 * @typedef {Object} sounds
 * @property {buffer} audioNode - Binary blobs from sound files
 */
const sounds = { "background": audioCtx.createBufferSource()
               , "thrust": audioCtx.createBufferSource()
               , "missile": audioCtx.createBufferSource()
               , "explosion": audioCtx.createBufferSource()
               };

let thrustSound = null;

function loadSound(url, audioNode) {
  fetch(url)
  .then((response) => response.arrayBuffer())
  .then((buffer) => audioCtx.decodeAudioData(buffer))
  .then((decodedData) => audioNode.buffer = decodedData);
}

function playSound_(audioNode) {
  const sound = audioCtx.createBufferSource();
  sound.buffer = audioNode.buffer;
  sound.connect(audioCtx.destination);
  sound.start();
  return sound;
}

/**
 * Public function to use sound objects
 * @function playSound
 * @param {"background" | "explosion" | "missile" | "thrust" | 
 * "backgroundStop" | "thrustStop"} soundName - key in sounds dictionary 
 * @returns {buffer} Return object needed to turn thrust sound off
 */
function playSound() {
  // state.noise is undefined if files haven't loaded yet
  if (window.state.noise === null || window.state.noise === undefined) {
      return;
  }
  switch (window.state.noise) {
    case "thrustStart":
      if (thrustSound === null) {
        thrustSound = playSound_(sounds["thrust"]);
      }
      break; 
    case "thrustStop":
      if (thrustSound !== null) {
        thrustSound.stop();
        thrustSound = null;
      }
      break;
    case "backgroundStop":
      sounds["background"].stop();
      break;
    default:
      playSound_(sounds[window.state.noise]); 
  }
  window.state.noise = null;
}

loadSound("./sounds/soundtrack.ogg", sounds["background"]);
loadSound("./sounds/thrust.ogg", sounds["thrust"]);
loadSound("./sounds/missile.ogg", sounds["missile"]);
loadSound("./sounds/explosion.ogg", sounds["explosion"]);
sounds["background"].loop = true;
sounds["background"].connect(audioCtx.destination);
sounds["background"].start();

export { playSound };

