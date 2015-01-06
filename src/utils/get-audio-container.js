var audioContainer;
module.exports = function getAudioContainer() {
  if (!audioContainer) {
    audioContainer = document.createElement('div');
    var s = audioContainer.style;
    s.position = 'fixed';
    s.left = "-9999px";
    s.top = "0";
    audioContainer.id = "kwantegy-container";
    document.body.appendChild(audioContainer);
  }
  return audioContainer;
}