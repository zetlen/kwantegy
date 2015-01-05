var getContext = require('./utils/get-context'),
    extend = require('lodash.assign');

function whenTapeLoaded(tape, cb) {
  if (tape.getSource()) {
    cb();
  } else {
    tape.once('ready', cb);
  }
}

function Deck(conf) {
  this._context = getContext();
  this._gainNode = this._context.createGain();
  this._gainNode.connect(this._context.destination);
}

extend(Deck.prototype, {
  load: function(tape, cb) {
    var self = this;
    this.currentTape = tape;
    self.loading = true;
    tape.load();
    whenTapeLoaded(this.currentTape, cb);
  },
  play: function() {
    var self = this;
    if (!this.currentTape) throw new Error("No tape!");
    this.currentTape.feed(function(source, go) {
      source.connect(self._gainNode);
      go();
    });
  }
});

module.exports = function(conf) {
  return new Deck(conf);
}