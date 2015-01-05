var ctx;
module.exports = function() {
  return ctx && ctx || (ctx = new (window.AudioContext || window.webkitAudioContext)());
}