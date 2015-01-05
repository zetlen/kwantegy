var tester = new Audio(),
    no = /^no$/,
    test = function(typestring) {
      return !!tester.canPlayType(typestring).replace(no,'');
    },

    canPlayMpeg = test('audio/mpeg;'),

    playable = {
      mpeg: canPlayMpeg,
      mp3: canPlayMpeg || test('audio/mp3;'),
      ogg: test('audio/ogg; codecs="vorbis"'),
      wav: test('audio/wav; codecs="1"'),
      aac: test('audio/aac;'),
      webm: test('audio/webm; codecs="vorbis"')
    }

module.exports = function canPlay(filename) {
  return playable[filename.split('.').pop()];
}