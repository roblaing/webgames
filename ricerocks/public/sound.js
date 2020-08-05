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

function loadSound(url, audioNode) {
  fetch(url)
  .then((response) => response.arrayBuffer())
  .then((buffer) => audioCtx.decodeAudioData(buffer))
  .then((decodedData) => audioNode.buffer = decodedData);
}

/**
 * Public function to use sound objects
 * @function playSound
 * @param {AudioNode} audioNode - eg sounds["missile"]
 * @returns {buffer} Return object needed to turn thrust sound off
 */
function playSound(audioNode) {
  const sound = audioCtx.createBufferSource();
  sound.buffer = audioNode.buffer;
  sound.connect(audioCtx.destination);
  sound.start();
  return sound;
}

loadSound("soundtrack.ogg", sounds["background"]);
loadSound("thrust.ogg", sounds["thrust"]);
loadSound("missile.ogg", sounds["missile"]);
loadSound("explosion.ogg", sounds["explosion"]);
sounds["background"].loop = true;
sounds["background"].connect(audioCtx.destination);
sounds["background"].start();

export { sounds
       , playSound
       };

