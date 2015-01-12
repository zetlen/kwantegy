var tester = new Audio(),
    no = /^no$/,
    test = function(typestring) {
      return !!tester.canPlayType(typestring).replace(no,'');
    },

    canPlayMpeg,
    playable;



    playable = {
      mpeg: canPlayMpeg,
      mp3: canPlayMpeg || test('audio/mp3;'),
      ogg: test('audio/ogg; codecs="vorbis"'),
      wav: test('audio/wav; codecs="1"'),
      aac: test('audio/aac;'),
      webm: test('audio/webm; codecs="vorbis"')
    }

module.exports = {
  webAudioEnabled: function() {
    return typeof window.webkitAudioContext + typeof window.AudioContext !== "undefinedundefined";
  },
  canPlay: function(filename) {
    return playable[filename.split('.').pop()];
  }
}