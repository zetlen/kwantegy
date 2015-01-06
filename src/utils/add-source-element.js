var re = /\.(mp3|ogg|wav)$/,

sourceStrings = {
  "mp3": "audio/mp3",
  "ogg": "audio/ogg",
  "wav": "audio/wav"
};

function getTypeFromSource(source) {
  var match = source.match(re);
  if (!match || !match[1]) throw new Error("Unsupported filetype: " + source);
  return sourceStrings[match[1]];
}

module.exports = function addSourceElement(audioElm, source) {
  var srcElm = document.createElement('source');
  srcElm.setAttribute("src", source);
  srcElm.setAttribute("type", getTypeFromSource(source));
  audioElm.appendChild(srcElm);
  return audioElm;
}