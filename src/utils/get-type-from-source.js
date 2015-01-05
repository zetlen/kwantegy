var re = /\.(mp3|ogg|wav)$/,

sourceStrings = {
  "mp3": "audio/mp3",
  "ogg": "audio/ogg",
  "wav": "audio/wav"
};

module.exports = function getTypeFromSource(source) {
  var match = source.match(re);
  if (!match || !match[1]) throw new Error("Unsupported filetype: " + source);
  return sourceStrings[match[1]];
}