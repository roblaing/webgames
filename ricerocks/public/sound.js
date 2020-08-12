/**
 * @file Module simplifying JavaScript's audio to a public interface of an images dictionary and playSound function
 */

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Dictionary of sound objects
 * @typedef {Object} sounds
 * @property {buffer} audioNode - Binary blobs from sound files
 */
const sounds = {};
let thrustSound = null;

function loadSound(url, audioNode) {
  fetch(url)
  .then((response) => response.arrayBuffer())
  .then((buffer) => audioCtx.decodeAudioData(buffer))
  .then((decodedData) => audioNode.buffer = decodedData)
  .then(background => {
    if (audioNode === sounds["background"]) {
      audioNode.loop = true;
      audioNode.connect(audioCtx.destination);
      audioNode.start();
    }
  });
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
  if (state.noise === null || state.noise === undefined) {
      return;
  }
  switch (state.noise) {
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
      playSound_(sounds[state.noise]); 
  }
  state.noise = null;
}

