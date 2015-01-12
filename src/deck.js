var getContext = require('./utils/get-context'),
    extend = require('lodash.assign');

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
  },
  play: function() {
    var self = this;
    if (!this.currentTape) throw new Error("No tape!");
    this.currentTape.load(function(source) {
      self.loading = false;
      source.connect(self._gainNode);
      self.currentTape.feed();
    });
  },
  queue: function(deck) {
    this.currentTape.on('end', function() {
      deck.play();
    })
  }
});


function KDeck() {
  this.gain = getContext().createGain();
}

extend(KDeck.prototype, {
  play: function(ktape) {
     this.gain.connect(getContext().destination);
     ktape.feed().connect(this.gain);
     ktape.play();
  }
})

module.exports = function(conf) {
  return new KDeck(conf);
}