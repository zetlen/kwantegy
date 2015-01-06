var reduce = require('lodash.reduce');
var extend = require('lodash.assign');
var find = require('lodash.find');
var bind = require('lodash.bind');
var getContext = require('./utils/get-context');
var canPlay = require('./utils/can-play');
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var tapeManager = require('./tape-manager');

var context = getContext();

function Tape(sources) {
  EventEmitter.apply(this);
  this.sources = sources = typeof sources === "string" ? [sources] : sources;
  tapeManager.add(this);
  this.feed = bind(this.feed, this);
}
inherits(Tape, EventEmitter);
extend(Tape.prototype, {
  feed: function() {
    throw "Cannot feed an abstract Tape";
  }
});


// streaming tape
var domready = require('domready');
var getAudioContainer = require('./utils/get-audio-container');
var addSourceElement = require('./utils/add-source-element');

function StreamingTape() {
  Tape.apply(this, arguments);
}
inherits(StreamingTape, Tape);
extend(StreamingTape.prototype, {
  load: function(cb) {
    var self = this;
    var elm = new Audio();
    this._el = reduce(this.sources, addSourceElement, elm);
    this._el.addEventListener('canplaythrough', function() {
      self._source = context.createMediaElementSource(self._el);
      cb(self._source);
    });
    this._el.addEventListener('ended', function() {
      self.emit('end');
    })
    domready(function() {
      getAudioContainer().appendChild(self._el);
    });
  },
  feed: function(i) {
    this._el.play(i);
  }
});



// buffered tape
function BufferedTape() {
  Tape.apply(this, arguments);
}
inherits(BufferedTape, Tape);
extend(BufferedTape.prototype, {
  load: function(cb) {
    var self = this;
    var playableUrl = find(this.sources, canPlay);
    var request = new XMLHttpRequest();
    request.open('GET', playableUrl, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        if (!buffer) throw new Error("Could not decode " + playableUrl);
        self._buffer = buffer;
        cb();
      })
    };
    request.send();
  },
  feed: function(cb) {
    var self = this;
    if (this._source) this._source.stop();
    var node = this._source = context.createBufferSource();
    node.buffer = this._buffer;
    cb(node, function(i) {
      node.start(i || 0);
    });
  }
});

module.exports = function(sources, opts) {
  if (opts && opts.stream === false) {
    return new BufferedTape(sources);
  } else {
    return new StreamingTape(sources);
  }
}